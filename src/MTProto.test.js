/* eslint-disable */
import { methodFromSchema, constructorFromSchema } from './tl';

jest.mock('./createAuthorizationKey');
jest.mock('./sendRequest');
jest.mock('./decryptMessage');
jest.mock('./Connection');

import createAuthorizationKey from './createAuthorizationKey';
import sendRequest from './sendRequest';

import * as R from 'ramda';

import {
  API_HASH,
  API_ID, BAD_SERVER_SALT_CONSTRUCTOR, CONSTRUCTOR_KEY,
  MESSAGE_CONTAINER_CONSTRUCTOR, METHOD_KEY, MSGS_ACK_CONSTRUCTOR, MSGS_ACK_TYPE,
  NEW_SESSION_CREATED_CONSTRUCTOR,
  PING_METHOD,
  PONG_CONSTRUCTOR, PONG_TYPE, RPC_ERROR_TYPE, RPC_RESULT_TYPE,
  TYPE_KEY
} from './constants';
import MTProto, {
  STATUS_CHANGED_EVENT,
  AUTH_KEY_CREATED,
  AUTH_KEY_CREATE_FAILED,
  UPLOAD_PART_SIZE,
  DOWNLOAD_PART_SIZE,
} from './MTProto';
import schema from './tl/schema/layer108';
import { hexToArrayBuffer } from './utils';
import { isObjectOf } from './tl/schema/utils';
/* eslint-enable */

describe('MTProto', () => {
  const url = 'ws://exapmle.com/';
  it('auth key created', (done) => {
    createAuthorizationKey.mockResolvedValueOnce({
      authKey: 'key',
      authKeyId: 12312,
      serverSalt: 'asdfasdf',
    });

    const connection = new MTProto(url, schema);
    connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
      expect(e.status).toEqual(AUTH_KEY_CREATED);
      expect(connection.authKey).toEqual('key');
      expect(connection.authKeyId).toEqual(12312);
      expect(connection.serverSalt).toEqual('asdfasdf');
      done();
    });

    connection.init();
  });

  it('auth key where passed on init', (done) => {
    const authData = {
      authKey: [3, 4, 6, 1, 3],
      authKeyId: [4, 5, 1, 2],
      serverSalt: [2, 2, 1],
    };
    const connection = new MTProto(url, schema, authData);
    connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
      expect(e.status).toEqual(AUTH_KEY_CREATED);

      expect(e.detail.authKey).toEqual([3, 4, 6, 1, 3]);
      expect(e.detail.authKeyId).toEqual([4, 5, 1, 2]);
      expect(e.detail.serverSalt).toEqual([2, 2, 1]);

      expect(connection.authKey).toEqual([3, 4, 6, 1, 3]);
      expect(connection.authKeyId).toEqual([4, 5, 1, 2]);
      expect(connection.serverSalt).toEqual([2, 2, 1]);
      done();
    });
    connection.init();
  });

  it('auth key create failed', (done) => {
    createAuthorizationKey.mockRejectedValueOnce('some reason');

    const connection = new MTProto(url, schema);
    connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
      expect(e.status).toEqual(AUTH_KEY_CREATE_FAILED);
      done();
    });

    connection.init();
  });

  describe('request', () => {
    it('wrong connection status', () => {
      const connection = new MTProto(url, schema);
      return connection.request({ a: 1 }).catch((reason) => {
        expect(reason).toEqual(new Error('Auth key has not been created'));
      });
    });

    it('empty array buffer error', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({}).catch((reason) => {
          expect(reason).toEqual(new Error('empty array buffer of message'));
          done();
        });
      });
      connection.init();
    });

    it('send ping request', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = 'ec77be7a000000000e800b5e';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      const curried = jest.fn();
      curried.mockResolvedValue(response);
      sendRequest.mockReturnValue(curried);


      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({
          [TYPE_KEY]: PONG_TYPE,
          [METHOD_KEY]: PING_METHOD,
          pingId: BigInt(2323423423),
        }).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });

    it('send rpc call', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const curried = jest.fn();
      curried.mockResolvedValue(new ArrayBuffer());
      sendRequest.mockReturnValue(curried);

      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const method = R.partial(methodFromSchema, [schema]);
        const construct = R.partial(constructorFromSchema, [schema]);
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            api_hash: API_HASH,
            settings: construct('codeSettings'),
          },
        );

        connection.request(message).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });

    it('send with message previous acknowledgements', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = 'ec77be7a000000000e800b5e';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      const curried = jest.fn();
      curried.mockResolvedValue(response);
      sendRequest.mockReturnValue(curried);

      const connection = new MTProto(url, schema);
      connection.acknowledgements = [BigInt(1), BigInt(2)];
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const method = R.partial(methodFromSchema, [schema]);
        const construct = R.partial(constructorFromSchema, [schema]);
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            api_hash: API_HASH,
            settings: construct('codeSettings', {}),
          },
        );

        connection.request(message).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });
  });

  describe('handleResponse', () => {
    it('pong', () => {
      const connection = new MTProto(url, schema);
      const resolve = jest.fn();
      const reject = jest.fn();

      connection.rpcPromises[BigInt(123)] = { resolve, reject };
      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: {
          [TYPE_KEY]: PONG_CONSTRUCTOR,
          msgId: BigInt(123),
          pingId: BigInt(222),
        },
      });

      expect(resolve).toHaveBeenCalled();
    });

    it('new_session_created', () => {
      const connection = new MTProto(url, schema);

      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: {
          [TYPE_KEY]: NEW_SESSION_CREATED_CONSTRUCTOR,
          serverSalt: BigInt('14078893447025144951'),
          uniqueId: BigInt('10125449296245655081'),
          firstMsgId: BigInt('6798186738482151424'),
        },
      });

      const serverSalt = new Uint8Array([119, 52, 130, 52, 255, 70, 98, 195]);

      expect(connection.serverSalt).toEqual(serverSalt);
      expect(connection.acknowledgements).toHaveLength(1);
      expect(connection.acknowledgements[0]).toEqual(BigInt(123123));
    });

    it('rpc_result success', () => {
      const connection = new MTProto(url, schema);

      const resolve = jest.fn();
      const reject = jest.fn();
      connection.rpcPromises[BigInt('6798192296169832448')] = { resolve, reject };

      const message = {
        seqNo: 3,
        msgId: BigInt('6798192297014662145'),
        body: {
          [TYPE_KEY]: RPC_RESULT_TYPE,
          reqMsgId: BigInt('6798192296169832448'),
          result: {
            [CONSTRUCTOR_KEY]: 'auth.sentCode',
            [TYPE_KEY]: 'auth.SentCode',
            phone_registered: true,
            phone_code_hash: '5da04370ae8bd21278',
          },
        },
      };

      connection.handleResponse(message);

      expect(resolve).toHaveBeenCalledWith({
        [CONSTRUCTOR_KEY]: 'auth.sentCode',
        [TYPE_KEY]: 'auth.SentCode',
        phone_registered: true,
        phone_code_hash: '5da04370ae8bd21278',
      });
      expect(connection.acknowledgements).toHaveLength(1);
      expect(connection.acknowledgements[0]).toEqual(BigInt('6798192297014662145'));
    });

    it('rpc_result error', () => {
      const connection = new MTProto(url, schema);

      const resolve = jest.fn();
      const reject = jest.fn();
      connection.rpcPromises[BigInt('6798192296169832448')] = { resolve, reject };

      const message = {
        seqNo: 3,
        msgId: BigInt('6798192297014662145'),
        body: {
          [TYPE_KEY]: RPC_RESULT_TYPE,
          reqMsgId: BigInt('6798192296169832448'),
          result: {
            errorCode: 400,
            errorMessage: 'PHONE_NUMBER_INVALID',
            [TYPE_KEY]: RPC_ERROR_TYPE,
          },
        },
      };

      connection.handleResponse(message);

      expect(reject).toHaveBeenCalledWith({
        errorCode: 400,
        errorMessage: 'PHONE_NUMBER_INVALID',
        [TYPE_KEY]: RPC_ERROR_TYPE,
      });
      expect(connection.acknowledgements).toHaveLength(1);
      expect(connection.acknowledgements[0]).toEqual(BigInt('6798192297014662145'));
    });

    it('handle message container messages one by one', () => {
      const connection = new MTProto(url, schema);

      const resolvePing = jest.fn();
      const rejectPing = jest.fn();

      const resolveAuth = jest.fn();
      const rejectAuth = jest.fn();

      connection.rpcPromises[BigInt(123)] = {
        resolve: resolvePing,
        reject: rejectPing,
      };
      connection.rpcPromises[BigInt('6798192296169832448')] = {
        resolve: resolveAuth,
        reject: rejectAuth,
      };

      const message = {
        seqNo: 4,
        msgId: BigInt(232),
        body: {
          [TYPE_KEY]: MESSAGE_CONTAINER_CONSTRUCTOR,
          messages: [
            {
              msgId: BigInt(123123),
              seqNo: 13,
              body: {
                [TYPE_KEY]: PONG_CONSTRUCTOR,
                msgId: BigInt(123),
                pingId: BigInt(222),
              },
            },
            {
              seqNo: 3,
              msgId: BigInt('6798192297014662145'),
              body: {
                [TYPE_KEY]: RPC_RESULT_TYPE,
                reqMsgId: BigInt('6798192296169832448'),
                result: {
                  errorCode: 400,
                  errorMessage: 'PHONE_NUMBER_INVALID',
                  [TYPE_KEY]: RPC_ERROR_TYPE,
                },
              },
            },
          ],
        },
      };

      connection.handleResponse(message);

      expect(resolvePing).toHaveBeenCalledWith({
        [TYPE_KEY]: PONG_CONSTRUCTOR,
        msgId: BigInt(123),
        pingId: BigInt(222),
      });
      expect(rejectAuth).toHaveBeenCalledWith({
        errorCode: 400,
        errorMessage: 'PHONE_NUMBER_INVALID',
        [TYPE_KEY]: RPC_ERROR_TYPE,
      });
      expect(connection.acknowledgements).toHaveLength(1);
      expect(connection.acknowledgements[0]).toEqual(BigInt('6798192297014662145'));
    });

    it('handle bad_server_salt', () => {
      const response = constructorFromSchema(
        schema,
        'nearestDc',
        { country: 'russia', this_dc: 2, nearest_dc: 2 },
      );

      const connection = new MTProto(url, schema);
      const resolve = jest.fn();
      const reject = jest.fn();
      const message = methodFromSchema(schema, 'help.getNearestDc');

      connection.rpcPromises[BigInt('6798186738482151424')] = { resolve, reject, message };
      connection.request = jest.fn().mockResolvedValue(response);
      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: {
          [TYPE_KEY]: BAD_SERVER_SALT_CONSTRUCTOR,
          badMsgId: BigInt('6798186738482151424'),
          badMsgSeqNo: 13,
          errorCode: 20,
          newServerSalt: BigInt('14078893447025144951'),
        },
      });
      const serverSalt = new Uint8Array([119, 52, 130, 52, 255, 70, 98, 195]);

      expect(connection.serverSalt).toEqual(serverSalt);
      expect(connection.request).toHaveBeenCalledWith(message);
    });

    it('handle msgs_ack', () => {
      const connection = new MTProto(url, schema);
      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: {
          [TYPE_KEY]: MSGS_ACK_TYPE,
          [CONSTRUCTOR_KEY]: MSGS_ACK_CONSTRUCTOR,
          msg_ids: [],
        },
      });
    });
  });

  describe('uplaod', () => {
    it('test upload file small file', (done) => {
      const file = new File(
        (new Array(1869)).fill(new ArrayBuffer(1024)),
        'avatar.jpg',
      );

      file.arrayBuffer = () => Promise.resolve(
        new ArrayBuffer(Math.ceil(DOWNLOAD_PART_SIZE * 3.5)),
      );

      const progressCb = jest.fn();

      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const connection = new MTProto(url, schema);
      connection.request = () => Promise.resolve('success');
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const { promise } = connection.upload(file, progressCb);
        promise.then((result) => {
          expect(progressCb).toHaveBeenCalledTimes(5);
          expect(isObjectOf('inputFile', result)).toEqual(true);
          expect(result.name).toEqual('avatar.jpg');
          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('md5_checksum');
          expect(result.parts).toEqual(4);
          done();
        });
      });
      connection.init();
    });

    it('test upload file file big file', (done) => {
      const file = new File(
        (new Array(15 * 1024)).fill(new ArrayBuffer(1024)),
        'avatar.jpg',
      );

      file.arrayBuffer = () => Promise.resolve(new ArrayBuffer(30 * UPLOAD_PART_SIZE));

      const progressCb = jest.fn();

      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const connection = new MTProto(url, schema);
      connection.request = () => Promise.resolve('success');
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const { promise } = connection.upload(file, progressCb);
        promise.then((result) => {
          expect(progressCb).toHaveBeenCalledTimes(31);
          expect(isObjectOf('inputFileBig', result)).toEqual(true);
          expect(result.name).toEqual('avatar.jpg');
          expect(result).toHaveProperty('id');
          expect(result.parts).toEqual(30);
          done();
        });
      });
      connection.init();
    });


    it('cancel uploading', (done) => {
      const file = new File(
        (new Array(15 * 1024)).fill(new ArrayBuffer(1024)),
        'avatar.jpg',
      );

      file.arrayBuffer = () => Promise.resolve(new ArrayBuffer(30 * UPLOAD_PART_SIZE));

      const progressCb = jest.fn();

      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const connection = new MTProto(url, schema);
      connection.request = () => new Promise((resolve) => setTimeout(
        () => resolve('success'),
        100,
      ));
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const data = connection.upload(file, progressCb);
        const { promise, cancel } = data;
        promise
          .then(() => done(new Error('uploaded')))
          .catch((error) => {
            expect(error.message).toEqual('canceled');
            done();
          });
        setTimeout(() => cancel(), 50);
      });
      connection.init();
    });
  });

  it('fire updates that have been come from server', (done) => {
    const construct = R.partial(constructorFromSchema, [schema]);

    const connection = new MTProto(url, schema);
    const message = {
      body: construct(
        'updateShort',
        {
          date: 1586370014,
          update: construct(
            'updateMessagePoll',
            {
              poll_id: BigInt('5215579087627616260'),
              results: construct(
                'pollResults',
                {
                  min: true,
                  results: [
                    construct(
                      'pollAnswerVoters',
                      {
                        chosen: false,
                        correct: false,
                        option: [48],
                        voters: 10006,
                      },
                    ),
                    construct(
                      'pollAnswerVoters',
                      {
                        chosen: false,
                        correct: false,
                        option: [49],
                        voters: 10006,
                      },
                    ),
                    construct(
                      'pollAnswerVoters',
                      {
                        chosen: false,
                        correct: false,
                        option: [49],
                        voters: 10006,
                      },
                    ),
                  ],
                  total_voters: 26467,
                },
              ),
            },
          ),
        },
      ),
      bytes: 76,
      seqNo: 9,
      msgId: BigInt('6813405479128620033'),
    };
    connection.addEventListener('telegramUpdate', (e) => {
      expect(e.detail).toEqual(message.body);
      expect(connection.acknowledgements[0]).toEqual(BigInt('6813405479128620033'));
      done();
    });
    connection.handleResponse(message);
  });

  describe('download file', () => {
    const construct = R.partial(constructorFromSchema, [schema]);

    it('download file error', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const connection = new MTProto(url, schema);
      connection.request = () => Promise.resolve('success');
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        expect(() => connection.download({})).toThrowError();
        done();
      });
      connection.init();
    });

    it('download file without size with callback', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      const connection = new MTProto(url, schema);
      connection.request = jest.fn()
        .mockResolvedValueOnce(
          construct(
            'upload.file',
            {
              bytes: new Array(1 * DOWNLOAD_PART_SIZE),
              mtime: 1579673798,
              type: construct('storage.fileJpeg'),
            },
          ),
        )
        .mockResolvedValueOnce(
          construct(
            'upload.file',
            {
              bytes: new Array(2315),
              mtime: 1579673798,
              type: construct('storage.fileJpeg'),
            },
          ),
        );
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const photo = construct(
          'fileLocationToBeDeprecated',
          {
            local_id: 295908,
            volume_id: BigInt('257717321'),
          },
        );
        const peer = construct('peerSelf');
        const inputFileLocation = construct('inputPeerPhotoFileLocation', { peer, ...photo });

        const progressCb = jest.fn();

        const { promise } = connection.download(inputFileLocation, { progressCb });
        promise.then((result) => {
          expect(result.name).toEqual('image.jpg');
          expect(progressCb).toBeCalledTimes(3);
          done();
        });
      });
      connection.init();
    });

    it('download file with size and callback', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const resolvedValue = construct(
        'upload.file',
        {
          bytes: new Array(20),
          mtime: 1579673798,
          type: construct('storage.fileMov'),
        },
      );

      const connection = new MTProto(url, schema);
      connection.request = jest.fn()
        .mockResolvedValue(resolvedValue);

      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const size = 29560491;
        const inputDocumentFileLocation = construct(
          'inputDocumentFileLocation',
          {
            id: BigInt('5240348864103319253'),
            access_hash: BigInt('12421989964750953769'),
            /* eslint-disable */
            file_reference: [4, 77, 147, 139, 10, 0, 0, 0, 173, 94, 151, 31, 229, 33, 14, 216, 45, 215, 159, 253, 31, 11, 68, 166, 26, 28, 38, 214, 102],
            /* eslint-enable */
            thumb_size: 'm',
          },
        );

        const progressCb = jest.fn();
        const { promise } = connection
          .download(inputDocumentFileLocation, { size, progressCb });

        promise
          .then((result) => {
            expect(result.name).toEqual('video.mov');
            expect(progressCb).toBeCalledTimes(Math.ceil(size / DOWNLOAD_PART_SIZE + 1));
            done();
          });
      });
      connection.init();
    });

    it('cancel download', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const resolvedValue = construct(
        'upload.file',
        {
          bytes: new Array(20),
          mtime: 1579673798,
          type: construct('storage.fileMov'),
        },
      );

      const connection = new MTProto(url, schema);
      connection.request = () => new Promise(
        (resolve) => setTimeout(() => resolve(resolvedValue), 100),
      );

      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const size = 29560491;
        const inputDocumentFileLocation = construct(
          'inputDocumentFileLocation',
          {
            id: BigInt('5240348864103319253'),
            access_hash: BigInt('12421989964750953769'),
            /* eslint-disable */
            file_reference: [4, 77, 147, 139, 10, 0, 0, 0, 173, 94, 151, 31, 229, 33, 14, 216, 45, 215, 159, 253, 31, 11, 68, 166, 26, 28, 38, 214, 102],
            /* eslint-enable */
            thumb_size: 'm',
          },
        );

        const progressCb = jest.fn();
        const { promise, cancel } = connection
          .download(inputDocumentFileLocation, { size, progressCb });

        promise
          .then(() => done(new Error('downloaded')))
          .catch((error) => {
            expect(error.message).toEqual('canceled');
            done();
          });
        setTimeout(cancel, 50);
      });
      connection.init();
    });
  });
});
