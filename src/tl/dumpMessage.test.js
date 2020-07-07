import * as R from 'ramda';

import {
  BAD_MSG_NOTIFICATION_CONSTRUCTOR,
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_SERVER_SALT_CONSTRUCTOR,
  CONSTRUCTOR_KEY,
  DESTROY_SESSION_NONE_CONSTRUCTOR,
  DESTROY_SESSION_OK_CONSTRUCTOR,
  DESTROY_SESSION_CONSTRUCTOR,
  FUTURE_SALT_CONSTRUCTOR,
  FUTURE_SALTS_CONSTRUCTOR,
  GET_FUTURE_SALTS_METHOD,
  HTTP_WAIT_CONSTRUCTOR,
  MESSAGE_CONTAINER_CONSTRUCTOR,
  MSG_DETAILED_INFO_CONSTRUCTOR,
  MSG_NEW_DETAILED_INFO_CONSTRUCTOR,
  MSG_RESEND_ANS_REQ_METHOD,
  MSG_RESEND_REQ_METHOD,
  MSGS_ACK_CONSTRUCTOR,
  MSGS_ALL_INFO_CONSTRUCTOR,
  MSGS_STATE_INFO_CONSTRUCTOR,
  MSGS_STATE_REQ_METHOD,
  NEW_SESSION_CREATED_CONSTRUCTOR,
  PING_DELAY_DISCONNECT_METHOD,
  PING_METHOD,
  PONG_CONSTRUCTOR,
  RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
  RPC_ANSWER_DROPPED_CONSTRUCTOR,
  RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
  RPC_DROP_ANSWER_METHOD,
  RPC_ERROR_TYPE,
  RPC_RESULT_TYPE,
  TYPE_KEY,
  DESTROY_SESSION_TYPE,
  FUTURE_SALTS_TYPE,
  METHOD_KEY,
  HTTP_WAIT_TYPE,
  MESSAGE_CONTAINER_TYPE,
  MSG_DETAILED_INFO_TYPE,
  MSG_RESEND_REQ_TYPE,
  MSGS_ACK_TYPE,
  MSGS_ALL_INFO_TYPE,
  MSGS_STATE_INFO_TYPE,
  MSGS_STATE_REQ_TYPE,
  NEW_SESSION_CREATED_TYPE,
  PONG_TYPE,
  RPC_DROP_ANSWER_TYPE,
  RPC_ERROR_CONSTRUCTOR,
  RPC_RESULT_CONSTRUCTOR,
  RES_PQ_TYPE,
  REQ_PQ_METHOD, RES_PQ_CONSTRUCTOR, PQ_INNER_DATA_TYPE, PQ_INNER_DATA_CONSTRUCTOR,
} from '../constants';
import dumpMessage from './dumpMessage';
import schema from './schema/layer108.json';
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
          [CONSTRUCTOR_KEY]: BAD_MSG_NOTIFICATION_CONSTRUCTOR,
          badMsgId: BigInt('0x5e0af67900000000'),
          badSeqNo: 2,
          errorCode: 0x23,
        },
        hexStr: '11f8efa70000000079f60a5e0200000023000000',
      },
      {
        type: 'bad_server_salt',
        msg: {
          [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
          [CONSTRUCTOR_KEY]: BAD_SERVER_SALT_CONSTRUCTOR,
          badMsgId: BigInt('0x5e0af67900000000'),
          badSeqNo: 2,
          errorCode: 0x23,
          newServerSalt: BigInt('0x5e0b700a00000000'),
        },
        hexStr: '7b44abed0000000079f60a5e0200000023000000000000000a700b5e',
      },
      {
        type: 'destroy_session',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_TYPE,
          [CONSTRUCTOR_KEY]: DESTROY_SESSION_CONSTRUCTOR,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: '262151e77e34abe84fe1ef56',
      },
      {
        type: 'destory_session_none',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_TYPE,
          [CONSTRUCTOR_KEY]: DESTROY_SESSION_NONE_CONSTRUCTOR,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'c950d3627e34abe84fe1ef56',
      },
      {
        type: 'destroy_session_ok',
        msg: {
          [TYPE_KEY]: DESTROY_SESSION_TYPE,
          [CONSTRUCTOR_KEY]: DESTROY_SESSION_OK_CONSTRUCTOR,
          sessionId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'fc4520e27e34abe84fe1ef56',
      },
      {
        type: 'future_salt',
        msg: {
          [TYPE_KEY]: FUTURE_SALTS_TYPE,
          [CONSTRUCTOR_KEY]: FUTURE_SALT_CONSTRUCTOR,
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
          [CONSTRUCTOR_KEY]: FUTURE_SALTS_CONSTRUCTOR,
          reqMsgId: BigInt('0x5e0b800e00000000'),
          now: 255,
          salts: [
            {
              [TYPE_KEY]: FUTURE_SALTS_TYPE,
              [CONSTRUCTOR_KEY]: FUTURE_SALT_CONSTRUCTOR,
              validSince: 256,
              validUntil: 65536,
              salt: BigInt(257),
            },
            {
              [TYPE_KEY]: FUTURE_SALTS_TYPE,
              [CONSTRUCTOR_KEY]: FUTURE_SALT_CONSTRUCTOR,
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
          [TYPE_KEY]: FUTURE_SALTS_TYPE,
          [METHOD_KEY]: GET_FUTURE_SALTS_METHOD,
          num: 18,
        },
        hexStr: '04bd21b912000000',
      },
      {
        type: 'http_wait',
        msg: {
          [TYPE_KEY]: HTTP_WAIT_TYPE,
          [CONSTRUCTOR_KEY]: HTTP_WAIT_CONSTRUCTOR,
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
          [CONSTRUCTOR_KEY]: MESSAGE_CONTAINER_CONSTRUCTOR,
          messages: [
            {
              msgId: BigInt('0x5e072d4689993001'),
              seqNo: 1,
              body: {
                [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
                [CONSTRUCTOR_KEY]: NEW_SESSION_CREATED_CONSTRUCTOR,
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
                [CONSTRUCTOR_KEY]: PONG_CONSTRUCTOR,
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
          [CONSTRUCTOR_KEY]: MSG_DETAILED_INFO_CONSTRUCTOR,
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
          [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
          [CONSTRUCTOR_KEY]: MSG_NEW_DETAILED_INFO_CONSTRUCTOR,
          answerMsgId: BigInt('0x5e0b800e00000000'),
          bytes: 12,
          status: 0,
        },
        hexStr: 'dfb69d80000000000e800b5e0c00000000000000',
      },
      {
        type: 'msg_resend_ans_req',
        msg: {
          [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
          [METHOD_KEY]: MSG_RESEND_ANS_REQ_METHOD,
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
          [METHOD_KEY]: MSG_RESEND_REQ_METHOD,
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
          [CONSTRUCTOR_KEY]: MSGS_ACK_CONSTRUCTOR,
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
          [CONSTRUCTOR_KEY]: MSGS_ALL_INFO_CONSTRUCTOR,
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
          [CONSTRUCTOR_KEY]: MSGS_STATE_INFO_CONSTRUCTOR,
          reqMsgId: BigInt('0x5e072d4500000000'),
          info: [1, 1, 4, 12],
        },
        hexStr: '7db5de0400000000452d075e040101040c000000',
      },
      {
        type: 'msgs_state_req',
        msg: {
          [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
          [METHOD_KEY]: MSGS_STATE_REQ_METHOD,
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
          [CONSTRUCTOR_KEY]: NEW_SESSION_CREATED_CONSTRUCTOR,
          firstMsgId: BigInt('0x5e072d4500000000'),
          uniqueId: BigInt('0x8f5524a763de8c07'),
          serverSalt: BigInt('0x6b02abc667623eb7'),
        },
        hexStr: '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b',
      },
      {
        type: 'ping',
        msg: {
          [TYPE_KEY]: PONG_TYPE,
          [METHOD_KEY]: PING_METHOD,
          pingId: BigInt('0x5e0b800e00000000'),
        },
        hexStr: 'ec77be7a000000000e800b5e',
      },
      {
        type: 'ping_delay_disconnect',
        msg: {
          [TYPE_KEY]: PONG_TYPE,
          [METHOD_KEY]: PING_DELAY_DISCONNECT_METHOD,
          pingId: BigInt('0x5e0b800e00000000'),
          disconnectDelay: 75,
        },
        hexStr: '8c7b42f3000000000e800b5e4b000000',
      },
      {
        type: 'pong',
        msg: {
          [TYPE_KEY]: PONG_TYPE,
          [CONSTRUCTOR_KEY]: PONG_CONSTRUCTOR,
          msgId: BigInt('0x5e072d4500000000'),
          pingId: BigInt('0x56efe14fe8ab347e'),
        },
        hexStr: 'c573773400000000452d075e7e34abe84fe1ef56',
      },
      {
        type: 'rpc_answer_dropped',
        msg: {
          [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
          [CONSTRUCTOR_KEY]: RPC_ANSWER_DROPPED_CONSTRUCTOR,
          msgId: BigInt('0x5e0b800e00000000'),
          seqNo: 28,
          bytes: 255,
        },
        hexStr: 'b7d83aa4000000000e800b5e1c000000ff000000',
      },
      {
        type: 'rpc_answer_dropped_running',
        msg: {
          [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
          [CONSTRUCTOR_KEY]: RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
        },
        hexStr: '86e578cd',
      },
      {
        type: 'rpc_answer_dropped_unknown',
        msg: {
          [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
          [CONSTRUCTOR_KEY]: RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
        },
        hexStr: '6ed32a5e',
      },
      {
        type: 'rpc_drop_answer',
        msg: {
          [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
          [METHOD_KEY]: RPC_DROP_ANSWER_METHOD,
          reqMsgId: BigInt('0x5e0b800e00000000'),
        },
        hexStr: '40a7e458000000000e800b5e',
      },
      {
        type: 'rpc_error',
        msg: {
          [TYPE_KEY]: RPC_ERROR_TYPE,
          [CONSTRUCTOR_KEY]: RPC_ERROR_CONSTRUCTOR,
          errorCode: 18,
          errorMessage: 'Hello World!',
        },
        hexStr: '19ca4421120000000c48656c6c6f20576f726c6421000000',
      },
      {
        type: 'rpc_result',
        msg: {
          [TYPE_KEY]: RPC_RESULT_TYPE,
          [CONSTRUCTOR_KEY]: RPC_RESULT_CONSTRUCTOR,
          msgId: BigInt('0x5e0b86bc00000000'),
          result: {
            [TYPE_KEY]: RPC_ERROR_TYPE,
            [CONSTRUCTOR_KEY]: RPC_ERROR_CONSTRUCTOR,
            errorCode: 18,
            errorMessage: 'Hello World!',
          },
        },
        hexStr: '016d5cf300000000bc860b5e19ca4421120000000c48656c6c6f20576f726c6421000000',
      },
      {
        type: 'req_pq',
        msg: {
          [TYPE_KEY]: RES_PQ_TYPE,
          [METHOD_KEY]: REQ_PQ_METHOD,
          nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
        },
        hexStr: '78974660fce2ec8fa401b366e927ca8c8249053e',
      },
      {
        type: 'res_pq',
        msg: {
          [TYPE_KEY]: RES_PQ_TYPE,
          [CONSTRUCTOR_KEY]: RES_PQ_CONSTRUCTOR,
          nonce: BigInt('0xe77b80516c65fb87c206be9614b20196'),
          server_nonce: BigInt('0x2729111eee6e0d2f324df77ee7234c71'),
          pq: [0x1f, 0xab, 0x62, 0x7f, 0xc4, 0x07, 0xef, 0x5d],
          fingerprints: [BigInt('0xc3b42b026ce86b21')],
        },
        /* eslint-disable */
        hexStr: '632416059601b21496be06c287fb656c51807be7714c23e77ef74d322f0d6eee1e112927081fab627fc407ef5d00000015c4b51c01000000216be86c022bb4c3'
        /* eslint-enable */
      },
      {
        type: 'p_q_inner_data',
        msg: {
          [TYPE_KEY]: PQ_INNER_DATA_TYPE,
          [CONSTRUCTOR_KEY]: PQ_INNER_DATA_CONSTRUCTOR,
          pq: [24, 200, 94, 3, 181, 62, 67, 67],
          p: [73, 61, 208, 217],
          q: [86, 159, 99, 123],
          nonce: BigInt('287513148517520756130170381589593592680'),
          server_nonce: BigInt('299610360581182355831673463144976967368'),
          /* eslint-disable */
          new_nonce: BigInt('58171899112211659244984229964572781128134817992388846608035515552309198967881'),
          /* eslint-enable */
        },
        /* eslint-disable */
        hexStr: 'ec5ac9830818c85e03b53e434300000004493dd0d900000004569f637b0000006813462dcecf0a9b9670bca3a9044dd8c8662799d2ab2ae0f8eac72f44db66e149d49b4934ef1c6499929a12a005c0fc59dbe316f51b3cf51f9682d7cb209c80'
        /* eslint-enable */
      },
    ],
  );

  it('unexpected message', () => {
    const msg = { [TYPE_KEY]: 'unexpected_message' };
    expect(dump(msg)).toEqual(new ArrayBuffer());
  });
});
