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
  REQ_PQ_METHOD,
  RES_PQ_CONSTRUCTOR,
  PQ_INNER_DATA_TYPE,
  PQ_INNER_DATA_CONSTRUCTOR,
  PQ_INNER_DATA_TEMP_CONSTRUCTOR,
  SERVER_DH_PARAMS_TYPE,
  REQ_DH_PARAMS_METHOD,
  SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
  SERVER_DH_PARAMS_OK_CONSTRUCTOR,
  SERVER_DH_INNER_DATA_TYPE,
  SERVER_DH_INNER_DATA_CONSTRUCTOR, CLIENT_DH_INNER_DATA_TYPE, CLIENT_DH_INNER_DATA_CONSTRUCTOR,
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
      {
        type: 'p_q_inner_data_temp',
        msg: {
          [TYPE_KEY]: PQ_INNER_DATA_TYPE,
          [CONSTRUCTOR_KEY]: PQ_INNER_DATA_TEMP_CONSTRUCTOR,
          pq: [24, 200, 94, 3, 181, 62, 67, 67],
          p: [73, 61, 208, 217],
          q: [86, 159, 99, 123],
          nonce: BigInt('287513148517520756130170381589593592680'),
          server_nonce: BigInt('299610360581182355831673463144976967368'),
          /* eslint-disable */
          new_nonce: BigInt('58171899112211659244984229964572781128134817992388846608035515552309198967881'),
          /* eslint-enable */
          expires_in: 192,
        },
        /* eslint-disable */
        hexStr: 'd4846a3c0818c85e03b53e434300000004493dd0d900000004569f637b0000006813462dcecf0a9b9670bca3a9044dd8c8662799d2ab2ae0f8eac72f44db66e149d49b4934ef1c6499929a12a005c0fc59dbe316f51b3cf51f9682d7cb209c80c0000000',
        /* eslint-enable */
      },
      {
        type: 'req_DH_params',
        msg: {
          [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
          [METHOD_KEY]: REQ_DH_PARAMS_METHOD,
          nonce: BigInt('0x8dcfcbf2ee27d8e785d1962ea1af3dd7'),
          server_nonce: BigInt('0x2f015ca9533aac03524a716ec11cd433'),
          p: [72, 142, 110, 125],
          q: [100, 212, 8, 23],
          fingerprint: BigInt('0xc3b42b026ce86b21'),
          /* eslint-disable */
          encrypted_data: [90,112,196,24,83,96,199,211,238,247,37,243,158,226,2,100,15,198,204,147,22,221,212,18,130,32,18,170,57,153,151,162,219,228,152,56,100,76,1,212,3,42,186,203,217,119,185,233,220,28,178,25,253,244,8,84,225,87,75,245,70,243,84,102,131,202,177,190,60,96,170,88,14,234,174,164,86,228,230,73,40,134,28,201,185,93,24,45,57,65,158,39,234,78,179,229,12,141,80,36,26,142,74,110,190,96,165,142,255,28,218,36,130,8,143,108,226,61,249,200,231,15,232,150,189,44,217,139,232,104,176,29,72,102,185,44,41,27,220,0,39,95,91,18,101,208,101,139,46,141,143,88,124,114,114,27,248,148,7,103,53,129,72,123,121,0,168,155,184,93,176,54,222,72,74,104,50,105,155,2,88,173,38,229,173,168,51,91,204,21,61,215,200,132,108,41,21,200,221,91,171,236,29,73,69,15,8,126,90,161,238,169,17,139,51,2,84,51,125,2,53,116,17,59,144,141,71,218,44,135,129,57,230,168,217,144,151,117,49,139,150,94,33,183,56,66,184,23,248,90,75,110,196,12,247,48],
          /* eslint-enable */
        },
        /* eslint-disable */
        hexStr: 'bee412d7d73dafa12e96d185e7d827eef2cbcf8d33d41cc16e714a5203ac3a53a95c012f04488e6e7d0000000464d40817000000216be86c022bb4c3fe0001005a70c4185360c7d3eef725f39ee202640fc6cc9316ddd412822012aa399997a2dbe49838644c01d4032abacbd977b9e9dc1cb219fdf40854e1574bf546f3546683cab1be3c60aa580eeaaea456e4e64928861cc9b95d182d39419e27ea4eb3e50c8d50241a8e4a6ebe60a58eff1cda2482088f6ce23df9c8e70fe896bd2cd98be868b01d4866b92c291bdc00275f5b1265d0658b2e8d8f587c72721bf89407673581487b7900a89bb85db036de484a6832699b0258ad26e5ada8335bcc153dd7c8846c2915c8dd5babec1d49450f087e5aa1eea9118b330254337d023574113b908d47da2c878139e6a8d9909775318b965e21b73842b817f85a4b6ec40cf730',
        /* eslint-enable */
      },
      {
        type: 'server_DH_params_fail',
        msg: {
          [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
          [CONSTRUCTOR_KEY]: SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
          nonce: BigInt('0x8dcfcbf2ee27d8e785d1962ea1af3dd7'),
          server_nonce: BigInt('0x2f015ca9533aac03524a716ec11cd433'),
          new_nonce_hash: BigInt('0x5817189911221165924498422996457278'),
        },
        /* eslint-disable */
        hexStr: '5d04cb79d73dafa12e96d185e7d827eef2cbcf8d33d41cc16e714a5203ac3a53a95c012f78724596294298449265112211991817',
        /* eslint-enable */
      },
      {
        type: 'server_DH_params_ok',
        msg: {
          [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
          [CONSTRUCTOR_KEY]: SERVER_DH_PARAMS_OK_CONSTRUCTOR,
          nonce: BigInt('0x19fd35605cfd0ba35810d6639b50d28a'),
          server_nonce: BigInt('0x60d47825536f4b0a5804adade13ba944'),
          /* eslint-disable */
          encrypted_answer: [192,238,28,102,82,246,106,222,47,14,214,67,80,24,203,117,17,208,228,82,174,230,141,172,222,93,126,251,112,24,119,162,16,225,90,16,4,148,236,208,58,136,98,171,126,87,90,190,44,161,143,45,136,243,235,132,206,236,35,48,222,73,70,11,72,234,79,1,60,147,237,188,244,67,63,228,31,75,62,98,210,38,220,41,130,136,145,20,87,242,21,128,12,254,53,152,3,0,242,128,229,80,238,178,21,238,167,166,227,205,46,87,41,56,6,35,66,221,62,248,155,128,58,65,1,153,254,9,125,248,224,130,146,53,149,238,177,64,106,75,143,31,17,222,24,116,144,39,221,60,182,62,196,54,202,204,87,118,186,45,167,28,173,137,32,156,47,250,37,184,210,84,162,220,55,86,39,247,228,92,217,41,251,146,229,143,41,234,180,84,255,80,82,24,110,21,179,206,127,28,17,255,254,29,138,117,168,219,74,29,117,101,102,139,170,200,20,199,25,106,22,251,148,191,161,201,11,109,137,248,148,159,233,19,164,48,132,232,225,232,154,74,139,152,55,97,44,239,47,152,246,87,126,159,172,164,72,202,134,163,225,129,198,18,171,36,86,142,142,252,161,73,200,215,73,110,84,67,133,72,108,206,50,43,133,231,8,229,32,23,144,47,72,211,125,29,105,15,235,127,197,89,0,77,75,210,117,5,133,28,90,46,68,169,69,45,13,18,94,14,246,34,248,208,67,106,212,223,78,162,103,111,102,187,192,88,201,165,218,214,245,37,173,219,56,30,58,4,48,152,154,70,223,213,157,181,210,38,65,90,158,45,161,165,183,47,48,55,99,210,169,233,235,118,92,137,154,199,18,149,197,144,66,224,3,72,233,42,104,98,15,129,110,178,67,69,202,16,180,116,194,126,108,254,59,199,73,232,66,52,213,89,205,238,187,123,48,48,223,72,42,211,253,249,73,38,205,239,230,220,251,80,45,156,0,48,232,166,52,230,184,35,105,34,251,247,95,178,150,116,124,48,139,119,165,37,49,228,178,152,32,28,141,31,133,99,246,134,67,70,217,115,206,195,36,116,58,193,106,43,86,28,96,136,74,220,179,234,214,10,119,164,147,219,80,222,104,216,78,248,54,57,182,184,21,185,51,217,5,125,242,28,60,191,206,4,182,116,144,233,26,90,107,175,251,151,169,195,181,206,246,115,152,32,74,143,51,230,6,163,178,2,56,190,134,160,70,148,59,107,76,63,139,187,205,119,59,247,51,50,126,91,117,162,65,160,50,88,204,58,244,11,176,106,167,112,254,92,78,13,134,23,29,27,203,201,186,57,55,63,207,139],
          /* eslint-enable */
        },
        /* eslint-disable */
        hexStr: '5c07e8d08ad2509b63d61058a30bfd5c6035fd1944a93be1adad04580a4b6f532578d460fe500200c0ee1c6652f66ade2f0ed6435018cb7511d0e452aee68dacde5d7efb701877a210e15a100494ecd03a8862ab7e575abe2ca18f2d88f3eb84ceec2330de49460b48ea4f013c93edbcf4433fe41f4b3e62d226dc298288911457f215800cfe35980300f280e550eeb215eea7a6e3cd2e572938062342dd3ef89b803a410199fe097df8e082923595eeb1406a4b8f1f11de18749027dd3cb63ec436cacc5776ba2da71cad89209c2ffa25b8d254a2dc375627f7e45cd929fb92e58f29eab454ff5052186e15b3ce7f1c11fffe1d8a75a8db4a1d7565668baac814c7196a16fb94bfa1c90b6d89f8949fe913a43084e8e1e89a4a8b9837612cef2f98f6577e9faca448ca86a3e181c612ab24568e8efca149c8d7496e544385486cce322b85e708e52017902f48d37d1d690feb7fc559004d4bd27505851c5a2e44a9452d0d125e0ef622f8d0436ad4df4ea2676f66bbc058c9a5dad6f525addb381e3a0430989a46dfd59db5d226415a9e2da1a5b72f303763d2a9e9eb765c899ac71295c59042e00348e92a68620f816eb24345ca10b474c27e6cfe3bc749e84234d559cdeebb7b3030df482ad3fdf94926cdefe6dcfb502d9c0030e8a634e6b8236922fbf75fb296747c308b77a52531e4b298201c8d1f8563f6864346d973cec324743ac16a2b561c60884adcb3ead60a77a493db50de68d84ef83639b6b815b933d9057df21c3cbfce04b67490e91a5a6baffb97a9c3b5cef67398204a8f33e606a3b20238be86a046943b6b4c3f8bbbcd773bf733327e5b75a241a03258cc3af40bb06aa770fe5c4e0d86171d1bcbc9ba39373fcf8b',
        /* eslint-enable */
      },
      {
        type: 'server_DH_inner_data',
        msg: {
          [TYPE_KEY]: SERVER_DH_INNER_DATA_TYPE,
          [CONSTRUCTOR_KEY]: SERVER_DH_INNER_DATA_CONSTRUCTOR,
          nonce: BigInt('0x923f00780580a638412a0b40dc2b4685'),
          server_nonce: BigInt('0x1cf9a119ce7c8e210ae1adad04e48e20'),
          g: 3,
          /* eslint-disable */
          dh_prime: [199,28,174,185,198,177,201,4,142,108,82,47,112,241,63,115,152,13,64,35,142,62,33,193,73,52,208,55,86,61,147,15,72,25,138,10,167,193,64,88,34,148,147,210,37,48,244,219,250,51,111,110,10,201,37,19,149,67,174,212,76,206,124,55,32,253,81,246,148,88,112,90,198,140,212,254,107,107,19,171,220,151,70,81,41,105,50,132,84,241,143,175,140,89,95,100,36,119,254,150,187,42,148,29,91,205,29,74,200,204,73,136,7,8,250,155,55,142,60,79,58,144,96,190,230,124,249,164,164,166,149,129,16,81,144,126,22,39,83,181,107,15,107,65,13,186,116,216,168,75,42,20,179,20,78,14,241,40,71,84,253,23,237,149,13,89,101,180,185,221,70,88,45,177,23,141,22,156,107,196,101,176,214,255,156,163,146,143,239,91,154,228,228,24,252,21,232,62,190,160,248,127,169,255,94,237,112,5,13,237,40,73,244,123,249,89,217,86,133,12,233,41,133,31,13,129,21,246,53,177,5,238,46,78,21,208,75,36,84,191,111,79,173,240,52,177,4,3,17,156,216,227,185,47,204,91],
          g_a: [169,126,45,64,202,129,79,96,35,220,235,22,71,131,211,7,42,72,87,73,26,230,62,210,150,190,99,202,21,225,55,180,167,160,51,133,86,249,51,14,153,74,199,54,91,187,252,32,81,176,218,123,91,81,88,40,239,250,43,72,220,209,75,40,100,33,32,103,206,246,62,83,228,66,245,214,106,64,226,46,111,107,139,245,59,26,212,16,93,208,39,78,70,98,76,15,240,18,155,38,27,175,16,164,204,177,182,76,115,161,133,60,149,176,120,93,181,213,239,76,161,101,217,1,237,202,177,21,199,242,141,200,223,164,147,201,12,254,173,183,216,214,144,150,82,26,171,145,225,177,13,86,12,180,201,13,183,80,240,250,151,227,13,116,89,77,142,174,253,253,29,253,13,209,175,79,96,59,248,11,64,64,25,182,173,176,184,93,228,241,72,208,22,80,99,209,198,17,68,32,241,1,132,251,91,5,153,233,5,138,150,3,168,86,229,17,182,248,85,144,182,152,127,251,247,247,197,186,158,163,47,173,88,11,213,141,22,172,169,169,55,37,236,50,217,8,68,64,33,203,86,234,85,245,62,141],
          /* eslint-enable */
          server_time: 1594225273,
        },
        /* eslint-disable */
        hexStr: 'ba0d89b585462bdc400b2a4138a6800578003f92208ee404adade10a218e7cce19a1f91c03000000fe000100c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5bfe000100a97e2d40ca814f6023dceb164783d3072a4857491ae63ed296be63ca15e137b4a7a0338556f9330e994ac7365bbbfc2051b0da7b5b515828effa2b48dcd14b2864212067cef63e53e442f5d66a40e22e6f6b8bf53b1ad4105dd0274e46624c0ff0129b261baf10a4ccb1b64c73a1853c95b0785db5d5ef4ca165d901edcab115c7f28dc8dfa493c90cfeadb7d8d69096521aab91e1b10d560cb4c90db750f0fa97e30d74594d8eaefdfd1dfd0dd1af4f603bf80b404019b6adb0b85de4f148d0165063d1c6114420f10184fb5b0599e9058a9603a856e511b6f85590b6987ffbf7f7c5ba9ea32fad580bd58d16aca9a93725ec32d908444021cb56ea55f53e8d79f2055f',
        /* eslint-enable */
      },
      {
        type: 'client_DH_inner_data',
        msg: {
          [TYPE_KEY]: CLIENT_DH_INNER_DATA_TYPE,
          [CONSTRUCTOR_KEY]: CLIENT_DH_INNER_DATA_CONSTRUCTOR,
          nonce: BigInt('0x55f50611d7393bc742f86fb523dddb98'),
          server_nonce: BigInt('0x70433e017a997e4ebb1c08e0e6ec3142'),
          retry_id: BigInt(0),
          /* eslint-disable */
          g_b: [182,226,83,36,18,82,32,81,121,37,110,148,128,146,213,101,164,9,149,166,109,125,193,139,238,5,52,75,253,74,135,225,204,215,246,168,246,58,135,120,156,249,171,74,101,119,126,220,26,17,37,96,184,143,0,164,45,189,156,87,14,202,150,92,249,86,181,37,87,234,92,115,153,231,28,139,0,204,59,8,216,180,33,43,75,124,133,195,149,59,228,209,7,137,45,102,248,21,3,17,78,193,88,209,31,191,167,211,78,137,69,79,97,221,98,11,64,94,228,191,189,50,15,55,62,182,188,106,11,118,148,76,75,213,110,71,79,191,247,110,7,204,107,31,115,245,196,11,49,184,143,89,117,43,117,132,225,199,101,149,8,80,225,122,111,242,63,128,5,123,148,190,135,162,66,25,234,205,192,192,67,208,13,23,117,55,36,180,146,224,33,201,235,129,132,64,224,254,248,150,253,10,243,3,29,163,49,222,39,217,67,48,127,240,180,36,3,180,4,33,128,165,23,17,50,21,168,121,68,204,112,213,148,237,3,53,33,73,86,228,204,55,240,55,3,123,253,5,2,54,54,166,120,229,121,79],
          /* eslint-enable */
        },
        /* eslint-disable */
        hexStr: '54b6436698dbdd23b56ff842c73b39d71106f5554231ece6e0081cbb4e7e997a013e43700000000000000000fe000100b6e253241252205179256e948092d565a40995a66d7dc18bee05344bfd4a87e1ccd7f6a8f63a87789cf9ab4a65777edc1a112560b88f00a42dbd9c570eca965cf956b52557ea5c7399e71c8b00cc3b08d8b4212b4b7c85c3953be4d107892d66f81503114ec158d11fbfa7d34e89454f61dd620b405ee4bfbd320f373eb6bc6a0b76944c4bd56e474fbff76e07cc6b1f73f5c40b31b88f59752b7584e1c765950850e17a6ff23f80057b94be87a24219eacdc0c043d00d17753724b492e021c9eb818440e0fef896fd0af3031da331de27d943307ff0b42403b4042180a517113215a87944cc70d594ed0335214956e4cc37f037037bfd05023636a678e5794f',
        /* eslint-enable */
      },
    ],
  );

  it('unexpected message', () => {
    const msg = { [TYPE_KEY]: 'unexpected_message' };
    expect(dump(msg)).toEqual(new ArrayBuffer());
  });
});
