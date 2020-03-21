/* eslint-disable */
import { methodFromSchema } from './tl';

jest.mock('./createAuthorizationKey');
jest.mock('./sendRequest');
jest.mock('./decryptMessage');

import createAuthorizationKey from './createAuthorizationKey';
import sendRequest from './sendRequest';
import decryptMessage from './decryptMessage';

import * as R from 'ramda';

import {
  API_HASH,
  API_ID, BAD_SERVER_SALT_TYPE, CONSTRUCTOR_KEY,
  HTTP_WAIT_TYPE, MESSAGE_CONTAINER_TYPE, MSGS_ACK_TYPE,
  NEW_SESSION_CREATED_TYPE,
  PING_TYPE,
  PONG_TYPE, RPC_ERROR_TYPE, RPC_RESULT_TYPE,
  TYPE_KEY
} from './constants';
import MTProto, { STATUS_CHANGED_EVENT, AUTH_KEY_CREATED, AUTH_KEY_CREATE_FAILED } from './MTProto';
import schema from './tl/schema/layer5';
import { hexToArrayBuffer } from './utils';
/* eslint-enable */

describe('MTProto', () => {
  const url = 'http://exapmle.com/';
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

    it('send http wait request', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      const curried = jest.fn();
      curried.mockResolvedValue(response);
      sendRequest.mockReturnValue(curried);
      decryptMessage.mockResolvedValueOnce({
        messageId: BigInt('2342143274123'),
        seqNo: 13,
        message: hexToArrayBuffer(hexStr),
      });

      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({
          [TYPE_KEY]: HTTP_WAIT_TYPE,
          maxDelay: 0,
          waitAfter: 0,
          maxWait: 25000,
        }).then(() => {
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
          pingId: BigInt(2323423423),
          [TYPE_KEY]: PING_TYPE,
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
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            sms_type: 0,
            lang_code: 'ru',
            api_hash: API_HASH,
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
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            sms_type: 0,
            lang_code: 'ru',
            api_hash: API_HASH,
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
          [TYPE_KEY]: PONG_TYPE,
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
          [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
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
          [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
          messages: [
            {
              msgId: BigInt(123123),
              seqNo: 13,
              body: {
                [TYPE_KEY]: PONG_TYPE,
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
        [TYPE_KEY]: PONG_TYPE,
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
      const connection = new MTProto(url, schema);
      const resolve = jest.fn();
      const reject = jest.fn();

      connection.rpcPromises[BigInt('6798186738482151424')] = { resolve, reject };
      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: {
          [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
          badMsgId: BigInt('6798186738482151424'),
          badMsgSeqNo: 13,
          errorCode: 20,
          newServerSalt: BigInt('14078893447025144951'),
        },
      });

      const serverSalt = new Uint8Array([119, 52, 130, 52, 255, 70, 98, 195]);

      expect(connection.serverSalt).toEqual(serverSalt);
      expect(reject).toHaveBeenCalled();
    });

    it('handle msgs_ack', () => {
      const connection = new MTProto(url, schema);
      connection.handleResponse({
        msgId: BigInt(123123),
        seqNo: 13,
        body: { [TYPE_KEY]: MSGS_ACK_TYPE, msg_ids: [] },
      });
    });
  });
});
