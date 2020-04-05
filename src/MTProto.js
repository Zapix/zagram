import * as R from 'ramda';

import createAuthorizationKey from './createAuthorizationKey';
import seqNoGenerator from './seqNoGenerator';
import {
  dumps, loads, methodFromSchema, constructorFromSchema,
} from './tl';
import encryptMessage from './encryptMessage';
import decryptMessage from './decryptMessage';
import {
  arrayBufferToHex,
  arrayBufferToUint8Array, debug,
  getMessageId,
  getNRandomBytes,
  promiseChain,
  sliceBuffer,
  uint8ToBigInt,
} from './utils';
import sendRequest from './sendRequest';
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

export const INIT = 'INIT';
export const AUTH_KEY_CREATED = 'AUTH_KEY_CREATED';
export const AUTH_KEY_CREATE_FAILED = 'AUTH_KEY_CREATE_FAILED';

export const STATUS_CHANGED_EVENT = 'statusChanged';

const PART_SIZE = 512 * 1024; // one part of file is 512KB

const getAuthKey = R.propOr(null, 'authKey');
const getAuthKeyId = R.propOr(null, 'authKeyId');
const getServerSalt = R.propOr(null, 'serverSalt');

const generateSessionId = R.partial(getNRandomBytes, [8]);

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
    if (this.isAuthKeyDataSet()) {
      this.genSeqNo = seqNoGenerator();
      this.sessionId = generateSessionId();
      this.emitAuthKeyCreated();
    } else {
      createAuthorizationKey(sendRequest(this.serverUrl))
        .then((authData) => {
          this.authKey = getAuthKey(authData);
          this.authKeyId = getAuthKeyId(authData);
          this.serverSalt = getServerSalt(authData);
          this.genSeqNo = seqNoGenerator();
          this.sessionId = generateSessionId();

          this.emitAuthKeyCreated();
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
    this.httpWait();
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

      const decrypt = R.partial(
        decryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId],
      );

      const sendEncryptedRequest = R.pipe(
        R.partial(dumps, [this.schema]),
        encrypt,
        sendRequest(this.serverUrl),
      );

      const promise = sendEncryptedRequest(message)
        .then((response) => response.arrayBuffer())
        .then(decrypt)
        .then(this.loadFromDecrypted.bind(this))
        .then(this.handleResponse.bind(this));

      if (isMessageOf(HTTP_WAIT_TYPE, message)) {
        promise.then(resolve).catch(reject);
      } else {
        this.rpcPromises[messageId] = { resolve, reject };
      }
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

      const decrypt = R.partial(
        decryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId],
      );

      const sendEncryptedRequest = R.pipe(
        debug,
        R.partial(dumps, [this.schema]),
        debug,
        encrypt,
        sendRequest(this.serverUrl),
      );

      const promise = sendEncryptedRequest(containerMessage)
        .then((response) => response.arrayBuffer())
        .then(decrypt)
        .then(this.loadFromDecrypted.bind(this))
        .then(this.handleResponse.bind(this));

      if (isMessageOf(HTTP_WAIT_TYPE, message)) {
        promise.then(resolve).catch(reject);
      } else {
        this.rpcPromises[messageId] = { resolve, reject };
      }
    });
  }

  handleResponse(message) {
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
    console.log('Switch to new server salt:', serverSalt);
    const buffer = dumpBigInt(serverSalt);
    this.serverSalt = new Uint8Array(buffer);

    const badMsgId = R.path(['body', 'badMsgId'], message);

    if (R.has(badMsgId, this.rpcPromises)) {
      this.rpcPromises[badMsgId].reject(message);
    }
  }

  handleRpcResult(message) {
    const msgId = R.prop('msgId', message);
    const reqMsgId = R.path(['body', 'reqMsgId'], message);
    const result = R.path(['body', 'result'], message);
    this.acknowledgements.push(msgId);

    if (isMessageOf(RPC_ERROR_TYPE, result)) {
      const reject = R.pathOr(() => {}, ['rpcPromises', reqMsgId, 'reject'], this);
      reject(result);
      delete this.rpcPromises[reqMsgId];
    } else {
      const resolve = R.pathOr(() => {}, ['rpcPromises', reqMsgId, 'resolve'], this);
      resolve(result);
      delete this.rpcPromises[reqMsgId];
    }
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
    console.log(arrayBufferToHex(message));
    const body = loads(this.schema, message);
    console.log(body);
    return {
      seqNo,
      body,
      msgId: messageId,
    };
  }

  httpWait() {
    this.request({
      [TYPE_KEY]: HTTP_WAIT_TYPE,
      maxDelay: 0,
      waitAfter: 0,
      maxWait: 25000,
    })
      .then(this.httpWait.bind(this));
  }

  /**
   * Takes file that should be uploaded, split by parts and upload them one by one.
   * Returns stream
   * @param {File} file - file that will be uploaded to telegram server
   * @param {Function} progressCb - callback function to track progress
   * @returns {PromiseLike<{ filename: string, fileId: BigInt, md5sum: string, parts: number}>}
   */
  upload(file, progressCb) {
    return file
      .arrayBuffer()
      .then((buffer) => {
        const fileId = uint8ToBigInt(getNRandomBytes(8));
        const parts = Math.ceil(buffer.byteLength / PART_SIZE);

        if (parts > 3000) {
          throw Error(`File ${file.filename} is too big`);
        }

        const sliceBufferByPart = R.pipe(
          R.pipe(R.of, R.ap([R.identity, R.add(1)]), R.map(R.multiply(PART_SIZE))),
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
        return promiseChain(uploadPromiseFuncs, progressCb).then(() => (constructorFromSchema(
          this.schema,
          inputFileConstructor,
          {
            parts,
            id: fileId,
            md5_checksum: '',
            name: file.name,
          },
        ))).then(debug);
      });
  }
}
