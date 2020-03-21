import * as R from 'ramda';

import {
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_SERVER_SALT_TYPE,
  DESTROY_SESSION_NONE_TYPE,
  DESTROY_SESSION_OK_TYPE,
  DESTROY_SESSION_TYPE,
  FUTURE_SALT_TYPE,
  FUTURE_SALTS_TYPE,
  GET_FUTURE_SALTS_TYPE,
  HTTP_WAIT_TYPE,
  MESSAGE_CONTAINER_TYPE,
  MSG_DETAILED_INFO_TYPE,
  MSG_NEW_DETAILED_INFO_TYPE,
  MSG_RESEND_ANS_REQ_TYPE,
  MSG_RESEND_REQ_TYPE,
  MSGS_ACK_TYPE,
  MSGS_ALL_INFO_TYPE,
  MSGS_STATE_INFO_TYPE,
  MSGS_STATE_REQ_TYPE,
  NEW_SESSION_CREATED_TYPE,
  PING_DELAY_DISCONNECT_TYPE,
  PING_TYPE,
  PONG_TYPE,
  RPC_ANSWER_DROPPED_RUNNING_TYPE,
  RPC_ANSWER_DROPPED_TYPE,
  RPC_ANSWER_UNKNOWN_TYPE,
  RPC_DROP_ANSWER_TYPE, RPC_ERROR_TYPE, RPC_RESULT_TYPE,
  TYPE_KEY,
} from '../constants';
import dumpMessage from './dumpMessage';
import schema from './schema/layer5.json';
import { arrayBufferToHex } from '../utils';

describe('dumpMessage', () => {
  const dump = R.partial(dumpMessage, [schema]);

  function testDump({ type, msg, hexStr }) {
    it(type, () => {
      const buffer = dump(msg);
      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });
  }

  R.forEach(
    testDump,
    [
      {
        type: 'bad_msg_notification',
        msg: {
          [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
          badMsgId: BigInt('0x5e0af67900000000'),
          badSeqNo: 2,
          errorCode: 0x23,
        },
        hexStr: '11f8efa70000000079f60a5e0200000023000000',
      },
      {
        type: 'bad_server_salt',
        msg: {
          [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
          badMsgId: BigInt('0x5e0af67900000000'),
          badSeqNo: 2,
          errorCode: 0x23,
          newServerSalt: BigInt('0x5e0b700a00000000'),
        },
        hexStr: '7b44abed0000000079f60a5e0200000023000000000000000a700b5e',
      },
      {
        type: 'destory_session',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_TYPE,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: '262151e77e34abe84fe1ef56',
      },
      {
        type: 'destory_session_none',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_NONE_TYPE,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'c950d3627e34abe84fe1ef56',
      },
      {
        type: 'destroy_session_ok',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_OK_TYPE,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'fc4520e27e34abe84fe1ef56',
      },
      {
        type: 'future_salt',
        msg: {
          [TYPE_KEY]: FUTURE_SALT_TYPE,
          validSince: 256,
          validUntil: 65536,
          salt: BigInt(257),
        },
        hexStr: 'dcd9490900010000000001000101000000000000',
      },
      {
        type: 'future_salts',
        msg: {
          [TYPE_KEY]: FUTURE_SALTS_TYPE,
          reqMsgId: BigInt('0x5e0b800e00000000'),
          now: 255,
          salts: [
            {
              [TYPE_KEY]: FUTURE_SALT_TYPE,
              validSince: 256,
              validUntil: 65536,
              salt: BigInt(257),
            },
            {
              [TYPE_KEY]: FUTURE_SALT_TYPE,
              validSince: 65537,
              validUntil: 16777216,
              salt: BigInt(4369),
            },
          ],
        },
        /* eslint-disable */
        hexStr: '950850ae000000000e800b5eff00000015c4b51c02000000dcd9490900010000000001000101000000000000dcd9490901000100000000011111000000000000',
        /* eslint-enable */
      },
      {
        type: 'get_future_salts',
        msg: {
          [TYPE_KEY]: GET_FUTURE_SALTS_TYPE,
          num: 18,
        },
        hexStr: '04bd21b912000000',
      },
      {
        type: 'http_wait',
        msg: {
          [TYPE_KEY]: HTTP_WAIT_TYPE,
          maxDelay: 0,
          waitAfter: 0,
          maxWait: 25000,
        },
        hexStr: '9f3599920000000000000000a8610000',
      },
      {
        type: 'msg_container',
        msg: {
          [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
          messages: [
            {
              msgId: BigInt('0x5e072d4689993001'),
              seqNo: 1,
              body: {
                [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
                firstMsgId: BigInt('0x5e072d4500000000'),
                uniqueId: BigInt('0x8f5524a763de8c07'),
                serverSalt: BigInt('0x6b02abc667623eb7'),
              },
            },
            {
              msgId: BigInt('0x5e072d4689996801'),
              seqNo: 2,
              body: {
                [TYPE_KEY]: PONG_TYPE,
                msgId: BigInt('0x5e072d4500000000'),
                pingId: BigInt('0x56efe14fe8ab347e'),
              },
            },
          ],
        },
        /* eslint-disable */
        hexStr: 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56',
        /* eslint-enable */
      },
      {
        type: 'msg_detailed_info',
        msg: {
          [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
          msgId: BigInt('0x5e0b700a00000000'),
          answerMsgId: BigInt('0x5e0b800e00000000'),
          bytes: 123,
          status: 0,
        },
        hexStr: 'c63e6d27000000000a700b5e000000000e800b5e7b00000000000000',
      },
      {
        type: 'msg_new_detailed_info',
        msg: {
          [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
          answerMsgId: BigInt('0x5e0b800e00000000'),
          bytes: 12,
          status: 0,
        },
        hexStr: 'dfb69d80000000000e800b5e0c00000000000000',
      },
      {
        type: 'msg_resend_ans_req',
        msg: {
          [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
          msgIds: [
            BigInt('0x5e0b700a00000000'),
            BigInt('0x5e0b800e00000000'),
          ],
        },
        hexStr: 'ebba108615c4b51c02000000000000000a700b5e000000000e800b5e',
      },
      {
        type: 'msg_resend_req',
        msg: {
          [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
          msgIds: [
            BigInt('0x5e0b700a00000000'),
            BigInt('0x5e0b800e00000000'),
          ],
        },
        hexStr: '081a867d15c4b51c02000000000000000a700b5e000000000e800b5e',
      },
      {
        type: 'msgs_ack',
        msg: {
          [TYPE_KEY]: MSGS_ACK_TYPE,
          msgIds: [
            BigInt('0x5e0b700a00000000'),
            BigInt('0x5e0b800e00000000'),
          ],
        },
        hexStr: '59b4d66215c4b51c02000000000000000a700b5e000000000e800b5e',
      },
      {
        type: 'msgs_all_info',
        msg: {
          [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
          msgIds: [
            BigInt('0x5e0b700a00000000'),
            BigInt('0x5e0b800e00000000'),
          ],
          info: [12, 13],
        },
        hexStr: '31d1c08c15c4b51c02000000000000000a700b5e000000000e800b5e020c0d00',
      },
      {
        type: 'msgs_state_info',
        msg: {
          [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
          reqMsgId: BigInt('0x5e072d4500000000'),
          info: [1, 1, 4, 12],
        },
        hexStr: '7db5de0400000000452d075e040101040c000000',
      },
      {
        type: 'msgs_state_req',
        msg: {
          [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
          msgIds: [
            BigInt('0x5e0b700a00000000'),
            BigInt('0x5e0b800e00000000'),
          ],
        },
        hexStr: '52fb69da15c4b51c02000000000000000a700b5e000000000e800b5e',
      },
      {
        type: 'new_session_created',
        msg: {
          [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
          firstMsgId: BigInt('0x5e072d4500000000'),
          uniqueId: BigInt('0x8f5524a763de8c07'),
          serverSalt: BigInt('0x6b02abc667623eb7'),
        },
        hexStr: '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b',
      },
      {
        type: 'ping',
        msg: {
          [TYPE_KEY]: PING_TYPE,
          pingId: BigInt('0x5e0b800e00000000'),
        },
        hexStr: 'ec77be7a000000000e800b5e',
      },
      {
        type: 'ping_delay_disconnect',
        msg: {
          [TYPE_KEY]: PING_DELAY_DISCONNECT_TYPE,
          pingId: BigInt('0x5e0b800e00000000'),
          disconnectDelay: 75,
        },
        hexStr: '8c7b42f3000000000e800b5e4b000000',
      },
      {
        type: 'pong',
        msg: {
          [TYPE_KEY]: PONG_TYPE,
          msgId: BigInt('0x5e072d4500000000'),
          pingId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'c573773400000000452d075e7e34abe84fe1ef56',
      },
      {
        type: 'rpc_answer_dropped',
        msg: {
          [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
          msgId: BigInt('0x5e0b800e00000000'),
          seqNo: 28,
          bytes: 255,
        },
        hexStr: 'b7d83aa4000000000e800b5e1c000000ff000000',
      },
      {
        type: 'rpc_answer_dropped_running',
        msg: {
          [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE,
        },
        hexStr: '86e578cd',
      },
      {
        type: 'rpc_answer_dropped_unknown',
        msg: {
          [TYPE_KEY]: RPC_ANSWER_UNKNOWN_TYPE,
        },
        hexStr: '6ed32a5e',
      },
      {
        type: 'rpc_drop_answer',
        msg: {
          [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
          reqMsgId: BigInt('0x5e0b800e00000000'),
        },
        hexStr: '40a7e458000000000e800b5e',
      },
      {
        type: 'rpc_error',
        msg: {
          [TYPE_KEY]: RPC_ERROR_TYPE,
          errorCode: 18,
          errorMessage: 'Hello World!',
        },
        hexStr: '19ca4421120000000c48656c6c6f20576f726c6421000000',
      },
      {
        type: 'rpc_result',
        msg: {
          [TYPE_KEY]: RPC_RESULT_TYPE,
          msgId: BigInt('0x5e0b86bc00000000'),
          result: {
            [TYPE_KEY]: RPC_ERROR_TYPE,
            errorCode: 18,
            errorMessage: 'Hello World!',
          },
        },
        hexStr: '016d5cf300000000bc860b5e19ca4421120000000c48656c6c6f20576f726c6421000000',
      },
    ],
  );

  it('unexpected message', () => {
    const msg = { [TYPE_KEY]: 'unexpected_message' };
    expect(dump(msg)).toEqual(new ArrayBuffer());
  });
});
