import * as R from 'ramda';

import sendWsRequest from './sendWsRequest';
import createAuthorizationKey from './createAuthorizationKey';
import seqNoGenerator from './seqNoGenerator';
import {
  dumps, loads, methodFromSchema, constructorFromSchema,
} from './tl';
import encryptMessage from './encryptMessage';
import decryptMessage from './decryptMessage';
import {
  arrayBufferToUint8Array,
  getMessageId,
  getNRandomBytes,
  promiseChain, promiseChainUntil,
  sliceBuffer, uint8ToArrayBuffer,
  uint8ToBigInt,
} from './utils';
import { isMessageOf } from './tl/utils';
import {
  BAD_SERVER_SALT_TYPE,
  HTTP_WAIT_TYPE,
  MESSAGE_CONTAINER_TYPE,
  MSGS_ACK_TYPE,
  NEW_SESSION_CREATED_TYPE,
  PONG_TYPE, RPC_ERROR_TYPE,
  RPC_RESULT_TYPE,
  TYPE_KEY,
} from './constants';
import { dumpBigInt } from './tl/bigInt';
import Connection from './Connection';
import { getFileName, getFileType } from './downloadHelpers';

export const INIT = 'INIT';
export const AUTH_KEY_CREATED = 'AUTH_KEY_CREATED';
export const AUTH_KEY_CREATE_FAILED = 'AUTH_KEY_CREATE_FAILED';
export const AUTH_KEY_ERROR = 'AUTH_KEY_ERROR';

export const STATUS_CHANGED_EVENT = 'statusChanged';
export const UPDATE_EVENT = 'telegramUpdate';

export const UPLOAD_PART_SIZE = 512 * 1024; // one part of file is 512KB
export const DOWNLOAD_PART_SIZE = 512 * 1024; // download part size

const getAuthKey = R.propOr(null, 'authKey');
const getAuthKeyId = R.propOr(null, 'authKeyId');
const getServerSalt = R.propOr(null, 'serverSalt');

const generateSessionId = R.partial(getNRandomBytes, [8]);

const getDownloadLimitOffset = R.pipe(
  R.of,
  R.ap([R.identity, R.always(1)]),
  R.map(R.multiply(DOWNLOAD_PART_SIZE)),
  R.zip(['offset', 'limit']),
  R.fromPairs,
);

/**
 * Class for working with mtproto protocols
 * Creates base connection on init. allows to send rpc calls, upload file to telegram server.
 * Emits events when connection status has been changed,
 */
export default class MTProto extends EventTarget {
  /**
   * Creates authorizationKey for mtproto on object init
   * @param {string} serverUrl - url of data center that will be used
   * @param {{constructors: *, methods: *}} schema - should be used for sending/receiving
   * @param {{ authKey: Uint8Array, authKeyId: Uint8Array, serverSalt: Uint8Array}} [authData]
   * messages from protocol
   */

  constructor(serverUrl, schema, authData) {
    super();
    this.status = INIT;
    this.serverUrl = serverUrl;
    this.schema = schema;
    this.ws = new Connection(serverUrl); // init ws connection;

    this.authKey = getAuthKey(authData);
    this.authKeyId = getAuthKeyId(authData);
    this.serverSalt = getServerSalt(authData);

    this.genSeqNo = null;
    this.sessionId = null;

    this.rpcPromises = {}; // dict where key is message id and value is resolve and reject functions
    this.acknowledgements = []; // array of message ids that should be send for acknowledgement
  }

  /**
   * Inits connection
   */
  init() {
    this.ws.addEventListener('wsOpen', () => {
      this.buildAuthKey();
    });
    this.ws.init();
  }

  /**
   * Checks has auth key been set before, if not tries to create it;
   */
  buildAuthKey() {
    if (this.isAuthKeyDataSet()) {
      this.genSeqNo = seqNoGenerator();
      this.sessionId = generateSessionId();
      this.emitAuthKeyCreated();
      this.ws.addEventListener('wsMessage', this.read.bind(this));
    } else {
      createAuthorizationKey(R.partial(sendWsRequest, [this.ws]))
        .then((authData) => {
          this.authKey = getAuthKey(authData);
          this.authKeyId = getAuthKeyId(authData);
          this.serverSalt = getServerSalt(authData);
          this.genSeqNo = seqNoGenerator();
          this.sessionId = generateSessionId();

          this.emitAuthKeyCreated();
          this.ws.addEventListener('wsMessage', this.read.bind(this));
        })
        .catch((error) => {
          this.status = AUTH_KEY_CREATE_FAILED;
          this.fireStatusChange(error);
        });
    }
  }

  isAuthKeyDataSet() {
    return Boolean(this.authKey);
  }

  emitAuthKeyCreated() {
    this.status = AUTH_KEY_CREATED;
    this.fireStatusChange();
  }

  handleAuthKeyError(error) {
    console.warn('Wrong auth key data', this.authKey, error);
  }

  fireStatusChange(error) {
    const event = new Event(STATUS_CHANGED_EVENT);
    event.status = this.status;
    if (error) {
      event.error = error;
    } else {
      event.detail = {
        authKey: this.authKey,
        authKeyId: this.authKeyId,
        serverSalt: this.serverSalt,
      };
    }
    this.dispatchEvent(event);
  }

  getSeqNo(isContentRelated) {
    const { value } = this.genSeqNo.next(isContentRelated);

    if (!isContentRelated && (value % 2 === 0)) {
      return this.genSeqNo.next(true).value;
    }

    return value;
  }


  /**
   * Handles message event from ws connection
   * @param {Event} encryptedBuffer
   */
  read(event) {
    const messageData = decryptMessage(
      this.authKey,
      this.authKeyId,
      this.serverSalt,
      this.sessionId,
      event.buffer,
    );
    const message = this.loadFromDecrypted(messageData);
    this.handleResponse(message);
  }

  /**
   * Sending message to telegram server. if message is http wait don't store message promise in
   * rpcPromises map, just return them. Checks have we got acknowledgements and if yest send request
   * with them
   * @param {*} message
   * @returns {Promise} - promise with handling request
   */
  request(message) {
    if (this.status !== 'AUTH_KEY_CREATED') {
      return Promise.reject(new Error('Auth key has not been created'));
    }

    const buffer = dumps(this.schema, message);

    if (buffer.byteLength === 0) {
      return Promise.reject(new Error('empty array buffer of message'));
    }

    if (this.acknowledgements.length > 0) {
      return this.sendRequestWithAcknowledgements(message);
    }
    return this.sendRequestOnly(message);
  }

  sendRequestOnly(message) {
    return new Promise((resolve, reject) => {
      const seqNo = this.getSeqNo();
      const messageId = getMessageId();

      const encrypt = R.partial(
        encryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId, seqNo, messageId],
      );

      const sendEncryptedRequest = R.pipe(
        R.partial(dumps, [this.schema]),
        encrypt,
        (x) => this.ws.send(x),
      );

      sendEncryptedRequest(message);
      this.rpcPromises[messageId] = { resolve, reject, message };
    });
  }

  sendRequestWithAcknowledgements(message) {
    return new Promise((resolve, reject) => {
      const ackMessage = this.buildAcknowledgementMessage();
      const ackMsgId = getMessageId();
      const ackSeqNo = this.getSeqNo();

      const messageId = getMessageId();
      const seqNo = this.getSeqNo();

      const containerMessage = {
        [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
        messages: [
          {
            seqNo: ackSeqNo,
            msgId: ackMsgId,
            body: ackMessage,
          },
          {
            seqNo,
            msgId: messageId,
            body: message,
          },
        ],
      };
      const containerMessageId = getMessageId();
      const containerSeqNo = (seqNo % 2 === 0) ? seqNo : this.getSeqNo(true);

      const encrypt = R.partial(
        encryptMessage,
        [
          this.authKey,
          this.authKeyId,
          this.serverSalt,
          this.sessionId,
          containerSeqNo,
          containerMessageId,
        ],
      );

      const sendEncryptedRequest = R.pipe(
        R.partial(dumps, [this.schema]),
        encrypt,
        (x) => this.ws.send(x),
      );

      const promise = sendEncryptedRequest(containerMessage);

      if (isMessageOf(HTTP_WAIT_TYPE, message)) {
        promise.then(resolve).catch(reject);
      } else {
        this.rpcPromises[messageId] = { resolve, reject, message };
      }
    });
  }

  handleResponse(message) {
    console.group('[MTPROTO] Income message');
    console.log(message);
    console.groupEnd();
    if (isMessageOf(MESSAGE_CONTAINER_TYPE, message.body)) {
      R.pipe(
        R.path(['body', 'messages']),
        R.map(this.handleResponse.bind(this)),
      )(message);
    } else if (isMessageOf(MSGS_ACK_TYPE, message.body)) {
      this.handleMsgsAck(message);
    } else if (isMessageOf(PONG_TYPE, message.body)) {
      this.handlePong(message);
    } else if (isMessageOf(NEW_SESSION_CREATED_TYPE, message.body)) {
      this.handleNewSessionCreated(message);
    } else if (isMessageOf(BAD_SERVER_SALT_TYPE, message.body)) {
      this.handleBadServerSalt(message);
    } else if (isMessageOf(RPC_RESULT_TYPE, message.body)) {
      this.handleRpcResult(message);
    } else if (isMessageOf('Updates')) {
      this.handleUpdates(message);
    } else {
      this.handleUnExpected(message);
    }
    return message;
  }

  /* eslint-disable */
  handleUnExpected(message) {
    console.warn('Unhandled message:');
    console.warn(message);
  }

  handleMsgsAck() {
  }
  /* eslint-enable */

  handlePong(message) {
    const { msgId } = message.body;
    const resolve = R.pathOr(() => {}, ['rpcPromises', msgId, 'resolve'], this);
    resolve(message.body);
    delete this.rpcPromises[msgId];
  }

  handleNewSessionCreated(message) {
    const msgId = R.prop('msgId', message);
    this.acknowledgements.push(msgId);

    const serverSalt = R.path(['body', 'serverSalt'], message);
    const buffer = dumpBigInt(serverSalt);
    this.serverSalt = new Uint8Array(buffer);
  }

  handleBadServerSalt(message) {
    const serverSalt = R.path(['body', 'newServerSalt'], message);
    const buffer = dumpBigInt(serverSalt);
    this.serverSalt = new Uint8Array(buffer);

    const badMsgId = R.path(['body', 'badMsgId'], message);

    if (R.has(badMsgId, this.rpcPromises)) {
      const { resolve, reject, message: requestMessage } = this.rpcPromises[badMsgId];
      this.request(requestMessage).then(resolve).catch(reject);
    }
  }

  handleRpcResult(message) {
    const msgId = R.prop('msgId', message);
    const reqMsgId = R.path(['body', 'reqMsgId'], message);
    const result = R.path(['body', 'result'], message);
    this.acknowledgements.push(msgId);

    if (isMessageOf(RPC_ERROR_TYPE, result)) {
      if (result.errorCode === 401) {
        this.handleAuthKeyError(result.errorMessage);
      }
      const reject = R.pathOr(() => {}, ['rpcPromises', reqMsgId, 'reject'], this);
      reject(result);
      delete this.rpcPromises[reqMsgId];
    } else {
      const resolve = R.pathOr(() => {}, ['rpcPromises', reqMsgId, 'resolve'], this);
      resolve(result);
      delete this.rpcPromises[reqMsgId];
    }
  }

  handleUpdates(message) {
    this.acknowledgements.push(message.msgId);
    const event = new Event(UPDATE_EVENT);
    event.detail = message.body;
    this.dispatchEvent(event);
  }

  buildAcknowledgementMessage() {
    const msg = {
      [TYPE_KEY]: MSGS_ACK_TYPE,
      msgIds: [...this.acknowledgements],
    };
    this.acknowledgements = [];
    return msg;
  }

  loadFromDecrypted({ messageId, message, seqNo }) {
    const body = loads(this.schema, message);
    return {
      seqNo,
      body,
      msgId: messageId,
    };
  }

  /**
   * Takes file that should be uploaded, split by parts and upload them one by one.
   * Returns stream
   * @param {File} file - file that will be uploaded to telegram server
   * @param {Function} progressCb - callback function to track progress
   * @returns {{
   *  promise: PromiseLike<{ filename: string, fileId: BigInt, md5sum: string, parts: number}>,
   *  cancel: Function,
   * }}
   */
  upload(file, progressCb) {
    let canceled = false;
    let cancelChain;

    function cancel() {
      console.log('Cancel promise for uploading');
      canceled = true;
      if (cancelChain) {
        console.log('call cancel chain func', cancelChain);
        cancelChain();
      }
    }

    const promise = file
      .arrayBuffer()
      .then((buffer) => {
        console.log('Is canceled: ', canceled);
        if (canceled) {
          return Promise.reject(new Error('canceled'));
        }
        const fileId = uint8ToBigInt(getNRandomBytes(8));
        const parts = Math.ceil(buffer.byteLength / UPLOAD_PART_SIZE);

        if (parts > 3000) {
          throw Error(`File ${file.filename} is too big`);
        }

        const sliceBufferByPart = R.pipe(
          R.pipe(R.of, R.ap([R.identity, R.add(1)]), R.map(R.multiply(UPLOAD_PART_SIZE))),
          R.apply(R.partial(sliceBuffer, [buffer])),
          arrayBufferToUint8Array,
        );

        const buildPartLoadObjects = R.pipe(
          R.of,
          R.ap([R.always(fileId), R.always(parts), R.identity, sliceBufferByPart]),
          R.zip(['file_id', 'file_total_parts', 'file_part', 'bytes']),
          R.fromPairs,
        );

        const bigFile = buffer.byteLength / (1024 * 1024) > 10;
        const uploadMethod = bigFile ? 'upload.saveBigFilePart' : 'upload.saveFilePart';

        const uploadPromiseFuncs = R.times(
          R.pipe(
            buildPartLoadObjects,
            R.partial(methodFromSchema, [this.schema, uploadMethod]),
            (message) => () => this.request(message),
          ),
          parts,
        );

        const inputFileConstructor = bigFile ? 'inputFileBig' : 'inputFile';
        const {
          promise: chainablePromise,
          cancel: cancelChainFunc,
        } = promiseChain(uploadPromiseFuncs, progressCb);
        cancelChain = cancelChainFunc;
        return chainablePromise
          .then(() => (constructorFromSchema(
            this.schema,
            inputFileConstructor,
            {
              parts,
              id: fileId,
              md5_checksum: '',
              name: file.name,
            },
          )));
      });
    return { cancel, promise };
  }

  /**
   * Downloads file by his location. If not `InputFileLocation` then reject file downloading,
   * If size has been passed then split file to download parts and download them one by one
   * If size hasn't been passed then download parts one by one until part lesser
   * then size of part wouldn't come. Join all parts and return whole file on promise
   * If location isn't `InputFileLocation` then raise error
   * @param {*} location - object of InputFileLocation telegrams type
   * @param {{ size: Number, progressCb: Function }} [options]- size and progress tracker
   * @returns {PromiseLike<File>}}
   */
  download(location, options) {
    if (location[TYPE_KEY] !== 'InputFileLocation') {
      throw new Error('Only `InputFileLocation` type is supported for downloading');
    }

    const progressCb = R.propOr(() => {}, 'progressCb', options);
    const size = R.propOr(null, 'size', options);
    let promise;
    let cancel;

    const buildDownloadRequest = R.pipe(
      R.mergeLeft({ location }),
      R.partial(methodFromSchema, [this.schema, 'upload.getFile']),
    );

    if (!size) {
      const getPromiseFunc = R.pipe(
        R.nthArg(1),
        getDownloadLimitOffset,
        buildDownloadRequest,
        (x) => this.request(x),
      );

      const isDownloadedPartSmaller = R.pipe(
        R.nthArg(0),
        R.path(['bytes', 'length']),
        R.gt(DOWNLOAD_PART_SIZE),
      );

      const result = promiseChainUntil(getPromiseFunc, isDownloadedPartSmaller, progressCb);
      promise = result.promise;
      cancel = result.cancel;
    } else {
      const parts = Math.ceil(size / DOWNLOAD_PART_SIZE);
      const downloadPromiseList = R.pipe(
        R.times(getDownloadLimitOffset),
        R.map(R.pipe(buildDownloadRequest, (x) => () => this.request(x))),
      )(parts);
      const result = promiseChain(downloadPromiseList, progressCb);
      promise = result.promise;
      cancel = result.cancel;
    }

    return {
      cancel,
      promise: promise
        .then((result) => new File(
          R.map(R.pipe(R.prop('bytes'), uint8ToArrayBuffer))(result),
          R.pipe(R.last, R.prop('type'), getFileName)(result),
          { type: R.pipe(R.last, getFileType)(result) },
        )),
    };
  }
}
