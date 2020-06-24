import * as R from 'ramda';

import loadMessage from './loadMessage';
import schema from './schema/layer108.json';
import {
  TYPE_KEY,
  BAD_MSG_NOTIFICATION_CONSTRUCTOR,
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
  NEW_SESSION_CREATED_TYPE,
  MESSAGE_CONTAINER_TYPE,
  HTTP_WAIT_TYPE,
  CONSTRUCTOR_KEY,
  BAD_MSG_NOTIFICATION_TYPE,
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
      [CONSTRUCTOR_KEY]: BAD_MSG_NOTIFICATION_CONSTRUCTOR,
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
    const hexStr = '016d5cf300000000bc860b5e0225005e04000000a2bb00c0040000001231653833383137316536633537323932353000e8030000';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toMatchObject({
      [TYPE_KEY]: RPC_RESULT_TYPE,
      reqMsgId: BigInt('0x5e0b86bc00000000'),
      result: {
        [CONSTRUCTOR_KEY]: 'auth.sentCode',
        [TYPE_KEY]: 'auth.SentCode',
        phone_code_hash: '1e838171e6c5729250',
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
    const hexStr = '0225005e04000000a2bb00c0040000001231653833383137316536633537323932353000e8030000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(load(buffer)).toEqual({
      [CONSTRUCTOR_KEY]: 'auth.sentCode',
      [TYPE_KEY]: 'auth.SentCode',
      type: {
        [CONSTRUCTOR_KEY]: 'auth.sentCodeTypeSms',
        [TYPE_KEY]: 'auth.SentCodeType',
        length: 4,
      },
      phone_code_hash: '1e838171e6c5729250',
      timeout: 1000,
    });
  });

  it('load by 108 schema config', () => {
    /* eslint-disable */
    const hexStr = '67400b33480e00006e92675e079f675eb57572990200000015c4b51c0a0000000da1b71804040000010000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71810000000010000000e3134392e3135342e3137352e313000500000000da1b718010000000100000027323030313a306232383a663233643a663030313a303030303a303030303a303030303a30303065bb0100000da1b71810000000020000000e3134392e3135342e3136372e343000bb0100000da1b71804040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71806040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000200000027323030313a303637633a303465383a663030323a303030303a303030303a303030303a30303065bb0100000da1b71810000000030000000f3134392e3135342e3137352e313137bb0100000da1b71804040000030000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000300000027323030313a306232383a663233643a663030333a303030303a303030303a303030303a30303065bb0100000e74617076332e7374656c2e636f6d001e0000000f00000064000000503403008813000030750000e093040030750000dc05000060ea0000020000001900000084030000ffffff7fffffff7f00ea2400c8000000050000002c0100000400000003000000204e0000905f010030750000102700000d68747470733a2f2f742e6d652f00000a636f6e74657874626f74000d666f7572737175617265626f74000008696d616765626f74000000000400000010000002000000';
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(schema, buffer)).toMatchObject({
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
    expect(loadMessage(schema, buffer)).toMatchObject({
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

  it('load 108 gzipped response from messages.getDialogs', () => {
    /* eslint-disable */
                 // 016d5cf338000000d4b8775ea1cf7230fe1203001f8b08000000000000035d527d485351143fd34adbca0cd2b4cf9b7fd456b26ac9d682cc22b159da979085186f6f77afbbde7b77bdf7365b11d9074543a494b28f8935c43f9248a10f93f52144e51f4552145450101445f657fd1568f76e2eab0387fbe3dc73ceef77cebd65727f5edec39b733200409b3fb3981da0247adbad6f2d50ceb08d790ef37c48196adf721dfecb7d15ce8252864be15fe3b9d3d87933a45d70b545123c96e5c37e21241b694e9c535cde68822417e74cf71bea6ba81f9967824d54222a12a90faf420e6e76b49e22951a4822618c8c3d444fde228322418d501517231cc62a227e76892348172229206818f935aaa01a2c63491394056673cd9f7251509117a3908e7dbc954c25c478198ad090f6a70409a24843aa61473b3052198f86047d2f2206f2538df3333daa84b0ac63bbd9ecf1f36ae4233e75918134bc2f8475e32fc95ea64c8bf0827146aab2369409d6900f8789c8c6d18912942388482ad5c62656b0ae0b12b603a4f7386811eef2fd5ac6307fafccb1fd72c0df86ef35bddfe3166f3dcf7f1dec89b1f5c3402c7e899f93983bf27337565daf3b98fdb9482ee4c1d2fa86be97a5b394b6b26381c58e53e294a12bef63008d4fccdbcc4461429606825882a5d7c6f5d8133d1f4c04a0c564b58a8d5737fcec52bb0a3d052b2f7bbe592d39cf36ccbbf1e9c8a5ce635fa281c1afdd4d076ae2e568ee65b1e9536b469fd8d239a5d9dad571ef71c160fcfc097f5bc9bba18b93566f2eba58f7ebe38b92cca70b7f6c6d4ffc7a9edf37d2dd5169f38a4b700f0c972f697e2207bfcbb1e1191fb3a1fdf19ba8cdb96dd77467c5ba2a97209e8b47e393b75bf7c7a33613ccbe75bfc1a4003c7d7438810e7d8de632bdbd6e803253ca4baa01f80ce959ea065cf26916e7be0776e64dabdd5de5a908a8cb944ad11e084a3c0ffeca1fa83ddeba038e26fff39adbbd275f3d78b8363bfd85d8fdd46a6a103f1105835055079858e270b95c001ef79de1d1d1d1c3bc7ef784d47bad3c7b86ac685913cb5c2b93ac0a418f28349c63b07fe476bb9dcee5dcc09cc48e24e63da0bfa1fe372b1bec8ed80300000000'
    const hexStr = '016d5cf338000000d4b8775ea1cf7230fe1203001f8b08000000000000035d527d485351143fd34adbca0cd2b4cf9b7fd456b26ac9d682cc22b159da979085186f6f77afbbde7b77bdf7365b11d9074543a494b28f8935c43f9248a10f93f52144e51f4552145450101445f657fd1568f76e2eab0387fbe3dc73ceef77cebd65727f5edec39b733200409b3fb3981da0247adbad6f2d50ceb08d790ef37c48196adf721dfecb7d15ce8252864be15fe3b9d3d87933a45d70b545123c96e5c37e21241b694e9c535cde68822417e74cf71bea6ba81f9967824d54222a12a90faf420e6e76b49e22951a4822618c8c3d444fde228322418d501517231cc62a227e76892348172229206818f935aaa01a2c63491394056673cd9f7251509117a3908e7dbc954c25c478198ad090f6a70409a24843aa61473b3052198f86047d2f2206f2538df3333daa84b0ac63bbd9ecf1f36ae4233e75918134bc2f8475e32fc95ea64c8bf0827146aab2369409d6900f8789c8c6d18912942388482ad5c62656b0ae0b12b603a4f7386811eef2fd5ac6307fafccb1fd72c0df86ef35bddfe3166f3dcf7f1dec89b1f5c3402c7e899f93983bf27337565daf3b98fdb9482ee4c1d2fa86be97a5b394b6b26381c58e53e294a12bef63008d4fccdbcc4461429606825882a5d7c6f5d8133d1f4c04a0c564b58a8d5737fcec52bb0a3d052b2f7bbe592d39cf36ccbbf1e9c8a5ce635fa281c1afdd4d076ae2e568ee65b1e9536b469fd8d239a5d9dad571ef71c160fcfc097f5bc9bba18b93566f2eba58f7ebe38b92cca70b7f6c6d4ffc7a9edf37d2dd5169f38a4b700f0c972f697e2207bfcbb1e1191fb3a1fdf19ba8cdb96dd77467c5ba2a97209e8b47e393b75bf7c7a33613ccbe75bfc1a4003c7d7438810e7d8de632bdbd6e803253ca4baa01f80ce959ea065cf26916e7be0776e64dabdd5de5a908a8cb944ad11e084a3c0ffeca1fa83ddeba038e26fff39adbbd275f3d78b8363bfd85d8fdd46a6a103f1105835055079858e270b95c001ef79de1d1d1d1c3bc7ef784d47bad3c7b86ac685913cb5c2b93ac0a418f28349c63b07fe476bb9dcee5dcc09cc48e24e63da0bfa1fe372b1bec8ed80300000000'
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(schema, buffer)).toMatchObject({
      [TYPE_KEY]: RPC_RESULT_TYPE,
      result: {
        chats: [],
        dialogs: expect.arrayContaining([
          expect.objectContaining({ [TYPE_KEY]: 'Dialog', [CONSTRUCTOR_KEY]: 'dialog' }),
        ]),
        messages: expect.arrayContaining([
          expect.objectContaining({ [TYPE_KEY]: 'Message', [CONSTRUCTOR_KEY]: 'message' }),
        ]),
        users: expect.arrayContaining([
          expect.objectContaining({ [TYPE_KEY]: 'User' }),
        ]),
        [CONSTRUCTOR_KEY]: 'messages.dialogs',
        [TYPE_KEY]: 'messages.Dialogs',
      },
    });
  });

  it('load 108 unzipped response', () => {
    /* eslint-disable */
    const hexStr = '406cba1515c4b51c02000000721f172c000000006dbcb19d28db0b0045000000290000000e0000001600000000000000209d50af00000000721f172c000000006dbcb19dd67607003e0000003e000000000000000000000000000000209d50af0f000000b5757299379779bc000000000764656661756c7415c4b51c02000000650e2c45800100004500000028db0b006dbcb19dd6760700d1b8775efe1e01004c6f67696e20636f64653a2032323232322e20446f206e6f742067697665207468697320636f646520746f20616e796f6e652c206576656e2069662074686579207361792074686579206172652066726f6d2054656c656772616d210a0a5468697320636f64652063616e206265207573656420746f206c6f6720696e20746f20796f75722054656c656772616d206163636f756e742e205765206e657665722061736b20697420666f7220616e797468696e6720656c73652e0a0a496620796f75206469646e27742072657175657374207468697320636f646520627920747279696e6720746f206c6f6720696e206f6e20616e6f74686572206465766963652c2073696d706c792069676e6f72652074686973206d6573736167652e000015c4b51c02000000c90b61bd000000000b000000c90b61bd1600000003000000650e2c45000300003e000000d67607006dbcb19dd6760700840b625e00000000d770b09c01000000c19ca29b01000000060000003216104b4daf5c7b08e7226c19010000003e5e77b8d43e1a6d9740836a2a3289630cd1a1df9c000080c80a520a696d6167652f6a706567002fad000015c4b51c020000002ebcb0e001690000920128286380aa48f5a66ea619491838a049ec280b0ece481eb4e6819ba483e98a6ac9eaab8c7a54a245201da0638ce69302b86392a40c8e28a69fbec718c9a29886669734dcd19a063d4f229a5cfbe3d33403cd26f4519dbcfbd016b8feab9f4a2962632b65b000ed452b8ec86c70ee6c9ced14e308009dc7da8a2936525a113647424d37616396a28aa209532878a28a2901001bb6bf77016d0000cdc67fbc207dea8a10000000b13900004001000040010000344e00000200000015c4b51c020000005cc1376c9001000090010000680059150f585f4d49476a6e306d4a632e6a706715c4b51c0000000015c4b51c02000000c15884935700820028db0b003fb7b187d6c0c4410854656c656772616d0000000d4e6f74696669636174696f6e73000005343237373700004939b9edffffff7fc15884935f040000d67607003895916933923f9c03416c6907476173796d6f760e7465737439393936363131313131000a39393936363231313131004939b9ed00ba775e'
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(schema, buffer)).toMatchObject({
      chats: [],
      dialogs: expect.arrayContaining([
        expect.objectContaining({ [TYPE_KEY]: 'Dialog', [CONSTRUCTOR_KEY]: 'dialog' }),
      ]),
      messages: expect.arrayContaining([
        expect.objectContaining({ [TYPE_KEY]: 'Message', [CONSTRUCTOR_KEY]: 'message' }),
      ]),
      users: expect.arrayContaining([
        expect.objectContaining({ [TYPE_KEY]: 'User' }),
      ]),
      [CONSTRUCTOR_KEY]: 'messages.dialogs',
      [TYPE_KEY]: 'messages.Dialogs',
    });
  });

  it('load updates 108 unzipped response', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f17302000000011cb5ad20ec8d5e09000000040100004042ae7415c4b51c01000000d904ba62f6a1199e00010000239d0600462f1b1732e5ddbdddda953e17ec8d5e37738a4815c4b51c01000000462f1b17007b08000100000015c4b51c01000000c158849347001000462f1b17f564a2ca0c420abb04496c6961000000084d616e6f6b68696e000000f1426fe215c4b51c010000001e961ad340314400ddda953eed287227b4218c6b1a4a617661536372697074204a6f627320e2809420d187d0b0d182000f6a6176617363726970745f6a6f6273d5db5c47cdc67fbc55c1ac0e00000000e3250200cdc67fbc55c1ac0e00000000e525020002000000f5477a57000000001804129f80040200ffffff7f17ec8d5e000000000124b5ad20ec8d5e0b000000180100004042ae7415c4b51c01000000d904ba62f6a1199e00010000108a0d00bdf1441232e5ddbd2f8c903d1fec8d5e37738a4815c4b51c01000000bdf14412ae840f000100000015c4b51c01000000c158849343001000bdf14412f748173e9d139eed04f09fa7b8000000f1426fe215c4b51c010000001e961ad3403144002f8c903d4f3ce647e01fb0093d526561637420e2809420d180d183d181d181d0bad0bed0b3d0bed0b2d0bed180d18fd189d0b5d0b520d181d0bed0bed0b1d189d0b5d181d182d0b2d0be00000872656163745f6a73000000d5db5c47cdc67fbc35029c0e0000000000270300cdc67fbc35029c0e0000000002270300020000009e430d57000000001804129f78850200ffffff7f1fec8d5e00000000'
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(schema, buffer)).toMatchObject({
      messages: [
        {
          body: {
            [CONSTRUCTOR_KEY]: 'updates',
            [TYPE_KEY]: 'Updates',
          },
          bytes: 260,
          seqNo: 9,
          msgId: BigInt('6813361436378864641'),
        },
        {
          body: {
            [CONSTRUCTOR_KEY]: 'updates',
            [TYPE_KEY]: 'Updates',
          },
          bytes: 280,
          seqNo: 11,
          msgId: BigInt('6813361436378866689'),
        },
      ],
      [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
    });
  });

  it('load updates gzipped', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1732000000005002197e7f88d5e0900000018000000c1ded47823d8fb1b2e4925004939b9ed13fa8d5ee6f88d5e01402197e7f88d5e0b0000004c000000c1ded4787b65a1ac0000000004000000f3d268485a7855570700000015c4b51c02000000d2da6d3b0000000001300000f9220000d2da6d3b0000000001310000262c00001f4f0000dcf88d5e01482197e7f88d5e0d0000004c000000c1ded4787b65a1ac00000000010000007a3a50485a7855570700000015c4b51c02000000d2da6d3b0000000001300000484c0000d2da6d3b000000000131000074140000bc600000e3f88d5e01602197e7f88d5e0f000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000000000000d2da6d3b000000000131000001000000d2da6d3b000000000132000000000000d2da6d3b000000000133000000000000d2da6d3b000000000134000000000000d2da6d3b000000000135000001000000d2da6d3b000000000136000000000000d2da6d3b000000000137000000000000d2da6d3b000000000138000000000000d2da6d3b00000000013900000000000002000000dbf88d5e01682197e7f88d5e11000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000000d000000d2da6d3b000000000131000013000000d2da6d3b00000000013200000d000000d2da6d3b000000000133000007000000d2da6d3b000000000134000003000000d2da6d3b00000000013500000b000000d2da6d3b000000000136000004000000d2da6d3b000000000137000003000000d2da6d3b000000000138000005000000d2da6d3b00000000013900001600000064000000e4f88d5e018cd62bebf88d5e130000003c0000004042ae7415c4b51c0100000024540b33000000001855014707a9000000000000eead000015c4b51c0000000015c4b51c00000000eaf88d5e0000000001e4d62bebf88d5e15000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000002b000000d2da6d3b000000000131000021000000d2da6d3b000000000132000017000000d2da6d3b00000000013300000a000000d2da6d3b000000000134000007000000d2da6d3b000000000135000019000000d2da6d3b000000000136000008000000d2da6d3b00000000013700000b000000d2da6d3b000000000138000008000000d2da6d3b000000000139000026000000ce000000e8f88d5e0130fb84f1f88d5e17000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000032000000d2da6d3b000000000131000022000000d2da6d3b00000000013200001c000000d2da6d3b00000000013300000e000000d2da6d3b000000000134000009000000d2da6d3b00000000013500001a000000d2da6d3b000000000136000008000000d2da6d3b00000000013700000c000000d2da6d3b000000000138000009000000d2da6d3b00000000013900002b000000e9000000eaf88d5e0134fb84f1f88d5e19000000840300004042ae7415c4b51c01000000f74d3f1b650e2c4580c600006877000032e5ddbdea802b3f30f78d5efe110100d09fd183d182d0b8d0bd20d181d180d0b0d0b2d0bdd0b8d0bb20d0bad0bed180d0bed0bdd0b0d0b2d0b8d180d183d18120d18120d0bfd0b5d187d0b5d0bdd0b5d0b3d0b0d0bcd0b820d0b820d0bfd0bed0bbd0bed0b2d186d0b0d0bcd0b82e20d09020d0bfd0bed0bbd18cd0b7d0bed0b2d0b0d182d0b5d0bbd0b820d181d0bed186d181d0b5d182d0b5d0b920d0bed182d0bad0bbd0b8d0bad0bdd183d0bbd0b8d181d18c20d0bdd0b020d18dd182d0be20d0b4d0b5d0bbd0be20d188d183d182d0bad0b0d0bcd0b820d0b820d0bcd0b5d0bcd0b0d181d0b0d0bcd0b82e20d092d0bed18220d0bfd0bed0b4d0b1d0bed180d0bad0b03a20687474703a2f2f6c656e746163682e6d656469612f64663363000000d750516901000000a50475d00000000026ad311b43b77148300718327e19ce501d023f2b80ea000077685e8df8ecb4a5222e4a544ecc933561efa57056e600002ff78d5e15c4b51c040000002ebcb0e001690000e0011c28bc208c3364e31ce2a2d91b9c2e4fa8a2e48fb348436e66e001e99aa7624fdb1598151c935925a177d4baf690226f2bed491c1119b600546dc8c8eb50de48fb9848e3cbec01a2d6e1a7cc44fcca328c7afd2a93068b61221294e72a3a1a2aa3a3f388e42cc704ed3451ab113885a45dd95e7df9a3ece4296cae073555aea58edf7ab0e3b1518a53752bc272472307e51e95168d8abbb96658ad198b9da4f4cf99ff00d7a6116d6e164b750cf9c6d0f926a99c054f9473eb56237d842aaa80473818aa72b0285f5263733a7cc6d580ee7cccd1535bb16049a2929b626ac70000001bb6bf77016d0000cdc67fbc998903922e000000c20a000040010000e40000006a6d00001bb6bf7701780000cdc67fbc998903922e000000c30a0000200300003b02000087bb01001bb6bf7701790000cdc67fbc998903922e000000c40a00000005000092030000905e03000200000015c4b51c010000003825d06e8700000019000000d12e0000ecf88d5e56e806000100000015c4b51c0000000015c4b51c010000001e961ad360301000ea802b3f641ec33a2ca53aac0cd09bd0b5d0bdd182d0b0d1870000000a6c656e746163686f6c6400d5db5c47cdc67fbc75a9510f0000000073b50100cdc67fbc75a9510f0000000075b5010002000000b6d1735700000000ecf88d5e000000000138fb84f1f88d5e1b000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000003f000000d2da6d3b00000000013100002a000000d2da6d3b000000000132000021000000d2da6d3b000000000133000012000000d2da6d3b00000000013400000d000000d2da6d3b000000000135000026000000d2da6d3b00000000013600000f000000d2da6d3b000000000137000011000000d2da6d3b00000000013800000f000000d2da6d3b00000000013900003600000034010000edf88d5e012c1dc504f98d5e1d000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000004b000000d2da6d3b000000000131000032000000d2da6d3b00000000013200002f000000d2da6d3b00000000013300001c000000d2da6d3b00000000013400000d000000d2da6d3b000000000135000035000000d2da6d3b00000000013600000f000000d2da6d3b000000000137000018000000d2da6d3b000000000138000016000000d2da6d3b00000000013900004e00000095010000f1f88d5e01381dc504f98d5e1f000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000005c000000d2da6d3b00000000013100003d000000d2da6d3b000000000132000036000000d2da6d3b000000000133000024000000d2da6d3b000000000134000011000000d2da6d3b000000000135000041000000d2da6d3b000000000136000012000000d2da6d3b00000000013700001b000000d2da6d3b000000000138000019000000d2da6d3b00000000013900005f000000ea010000f5f88d5e01401dc504f98d5e21000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000005f000000d2da6d3b000000000131000041000000d2da6d3b000000000132000039000000d2da6d3b000000000133000027000000d2da6d3b000000000134000011000000d2da6d3b000000000135000041000000d2da6d3b000000000136000012000000d2da6d3b00000000013700001b000000d2da6d3b000000000138000019000000d2da6d3b000000000139000062000000fa010000f5f88d5e01441dc504f98d5e23000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000075000000d2da6d3b000000000131000051000000d2da6d3b000000000132000041000000d2da6d3b00000000013300002d000000d2da6d3b000000000134000018000000d2da6d3b00000000013500004b000000d2da6d3b00000000013600001a000000d2da6d3b00000000013700001d000000d2da6d3b000000000138000021000000d2da6d3b00000000013900006f0000005e020000faf88d5e01481dc504f98d5e25000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000089000000d2da6d3b000000000131000062000000d2da6d3b000000000132000048000000d2da6d3b000000000133000033000000d2da6d3b00000000013400001d000000d2da6d3b000000000135000055000000d2da6d3b00000000013600001c000000d2da6d3b000000000137000026000000d2da6d3b000000000138000028000000d2da6d3b000000000139000080000000c2020000fef88d5e01501dc504f98d5e27000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000009b000000d2da6d3b00000000013100006f000000d2da6d3b00000000013200004d000000d2da6d3b00000000013300003a000000d2da6d3b000000000134000021000000d2da6d3b000000000135000060000000d2da6d3b00000000013600001c000000d2da6d3b00000000013700002a000000d2da6d3b00000000013800002a000000d2da6d3b00000000013900008c0000000e03000002f98d5e015c1dc504f98d5e29000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000a0000000d2da6d3b000000000131000075000000d2da6d3b00000000013200004f000000d2da6d3b00000000013300003c000000d2da6d3b000000000134000021000000d2da6d3b000000000135000062000000d2da6d3b00000000013600001c000000d2da6d3b00000000013700002c000000d2da6d3b00000000013800002b000000d2da6d3b0000000001390000900000002603000003f98d5e0184fb5b06f98d5e2b000000340000004042ae7415c4b51c0100000023d8fb1b2e4925004939b9ed31fa8d5e15c4b51c0000000015c4b51c0000000004f98d5e6f0000000110e5e220f98d5e2d000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000b2000000d2da6d3b00000000013100007f000000d2da6d3b00000000013200005c000000d2da6d3b000000000133000044000000d2da6d3b000000000134000023000000d2da6d3b000000000135000070000000d2da6d3b00000000013600001f000000d2da6d3b000000000137000031000000d2da6d3b000000000138000033000000d2da6d3b0000000001390000a50000008c03000008f98d5e0118e5e220f98d5e2f000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000c4000000d2da6d3b00000000013100008b000000d2da6d3b000000000132000066000000d2da6d3b00000000013300004b000000d2da6d3b000000000134000028000000d2da6d3b00000000013500007f000000d2da6d3b000000000136000022000000d2da6d3b000000000137000038000000d2da6d3b000000000138000038000000d2da6d3b0000000001390000b8000000f10300000df98d5e011ce5e220f98d5e31000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000dc000000d2da6d3b00000000013100009c000000d2da6d3b000000000132000074000000d2da6d3b000000000133000051000000d2da6d3b00000000013400002b000000d2da6d3b000000000135000084000000d2da6d3b000000000136000024000000d2da6d3b000000000137000040000000d2da6d3b00000000013800003a000000d2da6d3b0000000001390000ce0000005804000013f98d5e0124e5e220f98d5e33000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000ed000000d2da6d3b0000000001310000a8000000d2da6d3b00000000013200007e000000d2da6d3b000000000133000061000000d2da6d3b00000000013400002f000000d2da6d3b00000000013500008a000000d2da6d3b000000000136000028000000d2da6d3b000000000137000045000000d2da6d3b00000000013800003c000000d2da6d3b0000000001390000df000000b504000018f98d5e0128e5e220f98d5e35000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b0000000001300000f2000000d2da6d3b0000000001310000a8000000d2da6d3b00000000013200007f000000d2da6d3b000000000133000061000000d2da6d3b00000000013400002f000000d2da6d3b00000000013500008b000000d2da6d3b000000000136000028000000d2da6d3b000000000137000045000000d2da6d3b00000000013800003c000000d2da6d3b0000000001390000e0000000bd04000018f98d5e012ce5e220f98d5e37000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000000c010000d2da6d3b0000000001310000b4000000d2da6d3b000000000132000083000000d2da6d3b000000000133000069000000d2da6d3b000000000134000038000000d2da6d3b000000000135000096000000d2da6d3b00000000013600002a000000d2da6d3b000000000137000049000000d2da6d3b000000000138000043000000d2da6d3b0000000001390000f1000000210500001ff98d5e0160d1ba23f98d5e39000000340000004042ae7415c4b51c0100000023d8fb1b2e4925004939b9ed4ffa8d5e15c4b51c0000000015c4b51c0000000022f98d5e7000000001fcc25a3df98d5e3b0000005c010000a1cf7230fe5201001f8b080000000000000373705a57227a64ab0c130303834a08b731906290086574e758c90006efd73230dc64d99594caa7e3cac4c8c00012d7f35465307a7a772f489dedcfdeb8d60bf32eb682a0c2857d173603f1de8b3d0a1776285c6cbcd804e4edbcb0ebc206858bcd0a17f65ed87a612b92221d902a88d82ea0c8be8b0d17b65cd80154b6e162db851d17fb31946e0372f6e3300ce256a0131940fe01d107235a26d7cb40dcab97a3b883f3b1850b6b546241660503038ce6a802d1f145a540f5dce6966646a64686c69696e63db1d7dfdc5c69280dd27bf658fd1ecf92187e50783c696641e13f03f24161e769b9f3adf0afde3898dd72d3a42e332ab280c3d27e96c11fd35b0779c442528b8a128b324b73f514025253f2a16c86abb763dc41665ef9be1d6ce61f09881d30fe3f09881d8f248363c1f1c322341f44ffffffbfde0618fe2036001a114a57c801000000000140c35a3df98d5e3d000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000001b010000d2da6d3b0000000001310000c5000000d2da6d3b000000000132000088000000d2da6d3b000000000133000071000000d2da6d3b00000000013400003d000000d2da6d3b0000000001350000a0000000d2da6d3b00000000013600002e000000d2da6d3b00000000013700004e000000d2da6d3b000000000138000052000000d2da6d3b0000000001390000030100008705000025f98d5e0144c35a3df98d5e3f000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b00000000013000003b010000d2da6d3b0000000001310000cf000000d2da6d3b00000000013200008e000000d2da6d3b000000000133000079000000d2da6d3b00000000013400003f000000d2da6d3b0000000001350000ab000000d2da6d3b00000000013600002f000000d2da6d3b000000000137000052000000d2da6d3b000000000138000059000000d2da6d3b000000000139000013010000e80500002cf98d5e0148c35a3df98d5e41000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000050010000d2da6d3b0000000001310000d9000000d2da6d3b00000000013200009b000000d2da6d3b000000000133000083000000d2da6d3b000000000134000041000000d2da6d3b0000000001350000b3000000d2da6d3b000000000136000033000000d2da6d3b00000000013700005b000000d2da6d3b000000000138000062000000d2da6d3b0000000001390000230100004e06000033f98d5e0548c35a3df98d5e43000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000055010000d2da6d3b0000000001310000e2000000d2da6d3b0000000001320000a1000000d2da6d3b000000000133000086000000d2da6d3b000000000134000045000000d2da6d3b0000000001350000b9000000d2da6d3b000000000136000034000000d2da6d3b00000000013700005f000000d2da6d3b000000000138000065000000d2da6d3b0000000001390000300100008406000037f98d5e014cc35a3df98d5e45000000cc000000c1ded4787b65a1ac000000000600000043b771485a7855570700000015c4b51c0a000000d2da6d3b000000000130000064010000d2da6d3b0000000001310000e7000000d2da6d3b0000000001320000a6000000d2da6d3b00000000013300008a000000d2da6d3b000000000134000045000000d2da6d3b0000000001350000be000000d2da6d3b000000000136000035000000d2da6d3b000000000137000060000000d2da6d3b00000000013800006a000000d2da6d3b000000000139000037010000b40600003af98d5e0160c35a3df98d5e470000004c000000c1ded4787b65a1ac00000000030000008c9820485a7855570700000015c4b51c02000000d2da6d3b000000000130000078200000d2da6d3b0000000001310000dd0401005525010032f98d5e'
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(schema, buffer)).toMatchObject({
      messages: expect.arrayContaining([
        expect.objectContaining({
          bytes: expect.any(Number),
          seqNo: expect.any(Number),
        }),
      ]),
      [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
    });
  });
});
