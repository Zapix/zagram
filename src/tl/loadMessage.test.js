import * as R from 'ramda';

import loadMessage from './loadMessage';
import schema from './schema/layer5.json';
import schema108 from './schema/layer108.json';
import {
  TYPE_KEY,
  BAD_MSG_NOTIFICATION_TYPE,
  MSGS_ACK_TYPE,
  BAD_SERVER_SALT_TYPE,
  MSGS_STATE_REQ_TYPE,
  MSGS_STATE_INFO_TYPE,
  MSGS_ALL_INFO_TYPE,
  MSG_DETAILED_INFO_TYPE,
  MSG_NEW_DETAILED_INFO_TYPE,
  MSG_RESEND_REQ_TYPE,
  MSG_RESEND_ANS_REQ_TYPE,
  RPC_RESULT_TYPE,
  RPC_ERROR_TYPE,
  RPC_DROP_ANSWER_TYPE,
  RPC_ANSWER_DROPPED_RUNNING_TYPE,
  RPC_ANSWER_DROPPED_TYPE,
  GET_FUTURE_SALTS,
  FUTURE_SALT_TYPE,
  FUTURE_SALTS_TYPE,
  PING_TYPE,
  PONG_TYPE,
  PING_DELAY_DISCONNECT_TYPE,
  DESTROY_SESSION_TYPE,
  DESTROY_SESSION_OK_TYPE,
  DESTROY_SESSION_NONE_TYPE,
  NEW_SESSION_CREATED_TYPE, MESSAGE_CONTAINER_TYPE, HTTP_WAIT_TYPE, CONSTRUCTOR_KEY,
} from '../constants';
import { hexToArrayBuffer } from '../utils';

describe('load', () => {
  const load = R.partial(loadMessage, [schema]);

  it('pong', () => {
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: PONG_TYPE,
      msgId: BigInt('0x5e072d4500000000'),
      pingId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('ping', () => {
    const hexStr = 'ec77be7a000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: PING_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('ping_delay_disconnect', () => {
    const hexStr = '8c7b42f3000000000e800b5e4b000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: PING_DELAY_DISCONNECT_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
      disconnectDelay: 75,
    });
  });

  it('new session created', () => {
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
      firstMsgId: BigInt('0x5e072d4500000000'),
      uniqueId: BigInt('0x8f5524a763de8c07'),
      serverSalt: BigInt('0x6b02abc667623eb7'),
    });
  });

  it('parse message container', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
      messages: [
        {
          msgId: BigInt('0x5e072d4689993001'),
          seqNo: 1,
          bytes: 28,
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
          bytes: 20,
          body: {
            [TYPE_KEY]: PONG_TYPE,
            msgId: BigInt('0x5e072d4500000000'),
            pingId: BigInt('0x56efe14fe8ab347e'),
          },
        },
      ],
    });
  });

  it('bad message notification', () => {
    const hexStr = '11f8efa70000000079f60a5e0200000023000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
    });
  });

  it('bad server salt ', () => {
    // ed ab 44 7b
    const hexStr = '7b44abed0000000079f60a5e0200000023000000000000000a700b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
      newServerSalt: BigInt('0x5e0b700a00000000'),
    });
  });

  it('messages acknowledgment', () => {
    const hexStr = '59b4d66215c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ACK_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('rpc result', () => {
    /* eslint-disable */
    const hexStr = '016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toMatchObject({
      [TYPE_KEY]: RPC_RESULT_TYPE,
      reqMsgId: BigInt('0x5e0b86bc00000000'),
      result: {
        [CONSTRUCTOR_KEY]: 'auth.sentCode',
        [TYPE_KEY]: 'auth.SentCode',
        phone_registered: true,
        phone_code_hash: '5da04370ae8bd21278',
      },
    });
  });

  it('rpc error', () => {
    const hex = '19ca4421120000000c48656c6c6f20576f726c6421000000';
    const buffer = hexToArrayBuffer(hex);

    expect(load(buffer)).toEqual({
      errorCode: 18,
      [TYPE_KEY]: RPC_ERROR_TYPE,
      errorMessage: 'Hello World!',
    });
  });

  it('rpc drop answer', () => {
    const hexStr = '40a7e458000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('rpc answer unknown', () => {
    const hexStr = '6ed32a5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({ [TYPE_KEY]: RPC_DROP_ANSWER_TYPE });
  });

  it('rpc answer dropped running', () => {
    const hexStr = '86e578cd';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({ [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE });
  });

  it('rpc answer dropped', () => {
    const hexStr = 'b7d83aa4000000000e800b5e1c000000ff000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
      msgId: BigInt('0x5e0b800e00000000'),
      seqNo: 28,
      bytes: 255,
    });
  });

  it('load msgs_state_req', () => {
    const hexStr = '52fb69da15c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load msgs_state_info', () => {
    const hexStr = '7db5de0400000000452d075e040101040c000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
      reqMsgId: BigInt('0x5e072d4500000000'),
      info: [1, 1, 4, 12],
    });
  });

  it('load msgs_all_info', () => {
    const hexStr = '31d1c08c15c4b51c02000000000000000a700b5e000000000e800b5e020c0d00';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
      info: [12, 13],
    });
  });

  it('load msg_detailed_info', () => {
    const hexStr = 'c63e6d27000000000a700b5e000000000e800b5e7b00000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
      msgId: BigInt('0x5e0b700a00000000'),
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 123,
      status: 0,
    });
  });

  it('load msg_new_detailed_info', () => {
    const hexStr = 'dfb69d80000000000e800b5e0c00000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 12,
      status: 0,
    });
  });

  it('load msg_resend_req', () => {
    const hexStr = '081a867d15c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load msg_resend_ans_req', () => {
    const hexStr = 'ebba108615c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load get_future_salts', () => {
    const hexStr = '04bd21b912000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: GET_FUTURE_SALTS,
      num: 18,
    });
  });

  it('future_salt', () => {
    const hexStr = 'dcd9490900010000000001000101000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: FUTURE_SALT_TYPE,
      validSince: 256,
      validUntil: 65536,
      salt: BigInt(257),
    });
  });

  it('future_salts', () => {
    /* eslint-disable */
    const hexStr = '950850ae000000000e800b5eff00000015c4b51c02000000dcd9490900010000000001000101000000000000dcd9490901000100000000011111000000000000';
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);
    expect(load(buffer)).toEqual({
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
    });
  });

  it('destroy_session', () => {
    const hexStr = '262151e77e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });


  it('destroy_session_ok', () => {
    const hexStr = 'fc4520e27e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_OK_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('destroy_session_none', () => {
    const hexStr = 'c950d3627e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_NONE_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toBeNull();
  });

  it('http wait', () => {
    const hexStr = '9f3599920000000000000000a8610000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: HTTP_WAIT_TYPE,
      maxDelay: 0,
      waitAfter: 0,
      maxWait: 25000,
    });
  });

  it('load auth.sentCode', () => {
    const hexStr = 'bdbc1522b57572991237363064393638363661326264366539343500';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [CONSTRUCTOR_KEY]: 'auth.sentCode',
      [TYPE_KEY]: 'auth.SentCode',
      phone_registered: true,
      phone_code_hash: '760d96866a2bd6e945',
    });
  });

  it('load by 108 schema config', () => {
    /* eslint-disable */
    const hexStr = '67400b33480e00006e92675e079f675eb57572990200000015c4b51c0a0000000da1b71804040000010000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71810000000010000000e3134392e3135342e3137352e313000500000000da1b718010000000100000027323030313a306232383a663233643a663030313a303030303a303030303a303030303a30303065bb0100000da1b71810000000020000000e3134392e3135342e3136372e343000bb0100000da1b71804040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71806040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000200000027323030313a303637633a303465383a663030323a303030303a303030303a303030303a30303065bb0100000da1b71810000000030000000f3134392e3135342e3137352e313137bb0100000da1b71804040000030000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000300000027323030313a306232383a663233643a663030333a303030303a303030303a303030303a30303065bb0100000e74617076332e7374656c2e636f6d001e0000000f00000064000000503403008813000030750000e093040030750000dc05000060ea0000020000001900000084030000ffffff7fffffff7f00ea2400c8000000050000002c0100000400000003000000204e0000905f010030750000102700000d68747470733a2f2f742e6d652f00000a636f6e74657874626f74000d666f7572737175617265626f74000008696d616765626f74000000000400000010000002000000';
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(schema108, buffer)).toMatchObject({
      [CONSTRUCTOR_KEY]: 'config',
      [TYPE_KEY]: 'Config',
    });
  });

  it('load by 108 schema', () => {
    /* eslint-disable */

                 // dcf8f1730200000001dc3f146e92675e010000001c0000000809c29e100000006d92675ec5a54dc33d21ee03cca19449f0b2024401489d166e92675e0300000078010000016d5cf3100000006d92675e a1cf7230 fe 640100 1f8b08000000000000034b77e036f6e06360c89b941ec73e3f3d6e6b69d14c26060606d1235b65b88034efc2ed122c2c0c0c8c40369f9181b99ea1a9899e9189a19eb931c3790b0606c1bb7f6fa9fa54dcfca5a075d48c7d5ec70e0e881e0106a81e43134bb01e4373533d43038600a8998c507975230303432b8324230bab3423e314ab343017085089d4dd8c08739950cc3533d733316080c983dcca44a25bd9c8d0c3087507d4fd66e6c9560626a91620f71b11723f3310f3a3848ba139b2fb99c9700b33f6b034c6e516be92c4823263bde292d41cbde4fc5c0639909b80380588034c98193a8419180c4a19181e4c6601d377581918125e41fc2c09c42d400bffffff5f0fc20caf54184e00c5804a18748066b340dda3e0c7c030219e11ac5f401de8d68c929282622b7dfd12bddc547d0606aee4fcbc92d48a92a4fc1206deb4fcd2a2e2c2d2c4a254109781233337311dc284182800b11b00d131fb71b0020000
    const hexStr = 'dcf8f1730200000001dc3f146e92675e010000001c0000000809c29e100000006d92675ec5a54dc33d21ee03cca19449f0b2024401489d166e92675e0300000078010000016d5cf3100000006d92675ea1cf7230fe6401001f8b08000000000000034b77e036f6e06360c89b941ec73e3f3d6e6b69d14c26060606d1235b65b88034efc2ed122c2c0c0c8c40369f9181b99ea1a9899e9189a19eb931c3790b0606c1bb7f6fa9fa54dcfca5a075d48c7d5ec70e0e881e0106a81e43134bb01e4373533d43038600a8998c507975230303432b8324230bab3423e314ab343017085089d4dd8c08739950cc3533d733316080c983dcca44a25bd9c8d0c3087507d4fd66e6c9560626a91620f71b11723f3310f3a3848ba139b2fb99c9700b33f6b034c6e516be92c4823263bde292d41cbde4fc5c0639909b80380588034c98193a8419180c4a19181e4c6601d377581918125e41fc2c09c42d400bffffff5f0fc20caf54184e00c5804a18748066b340dda3e0c7c030219e11ac5f401de8d68c929282622b7dfd12bddc547d0606aee4fcbc92d48a92a4fc1206deb4fcd2a2e2c2d2c4a254109781233337311dc284182800b11b00d131fb71b0020000';

    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(schema108, buffer)).toMatchObject({
      [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
      messages: [
        {
          seqNo: 1,
          msgId: BigInt('6802566763650210817'),
          bytes: 28,
          body: {
            [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
            firstMsgId: BigInt('6802566759015514128'),
            serverSalt: BigInt('4900676089628893644'),
            uniqueId: BigInt('283200375724287429'),
          },
        },
        {
          seqNo: 3,
          msgId: BigInt('0x5e67926e169d4801'),
          bytes: 0x178,
          body: {
            [TYPE_KEY]: RPC_RESULT_TYPE,
            reqMsgId: BigInt('0x5e67926d00000010'),
            result: {},

          },
        },
      ],
    });
  });
});
