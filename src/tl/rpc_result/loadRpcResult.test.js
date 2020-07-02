import * as R from 'ramda';

import { arrayBufferToHex, hexToArrayBuffer, sliceBuffer } from '../../utils';
import loadRpcResult from './loadRpcResult';
import {
  TYPE_KEY,
  RPC_RESULT_TYPE,
  CONSTRUCTOR_KEY,
  RPC_RESULT_CONSTRUCTOR
} from '../../constants';

describe('loadRpcResult', () => {
  describe('not gzipped response', () => {
    /* eslint-disable */
    const hexStr = '016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    const customLoader = (x, withOffset) => {
      const value = new Uint8Array(x);
      if (withOffset) {
        return {
          value,
          offset: x.byteLength,
        };
      }
      return value;
    };

    const load = R.partialRight(loadRpcResult, [customLoader]);

    it('without offset', () => {
      expect(load(buffer)).toEqual({
        [TYPE_KEY]: RPC_RESULT_TYPE,
        [CONSTRUCTOR_KEY]: RPC_RESULT_CONSTRUCTOR,
        reqMsgId: BigInt('0x5e0b86bc00000000'),
        result: new Uint8Array(sliceBuffer(buffer, 12)),
      });
    });

    it('with offset', () => {
      expect(load(buffer, true)).toEqual({
        value: {
          [TYPE_KEY]: RPC_RESULT_TYPE,
          [CONSTRUCTOR_KEY]: RPC_RESULT_CONSTRUCTOR,
          reqMsgId: BigInt('0x5e0b86bc00000000'),
          result: new Uint8Array(sliceBuffer(buffer, 12)),
        },
        offset: 40,
      });
    });
  });

  describe('gzipped response', () => {
    /* eslint-disable */
    const hexStr = '016d5cf3100000006d92675ea1cf7230fe6401001f8b08000000000000034b77e036f6e06360c89b941ec73e3f3d6e6b69d14c26060606d1235b65b88034efc2ed122c2c0c0c8c40369f9181b99ea1a9899e9189a19eb931c3790b0606c1bb7f6fa9fa54dcfca5a075d48c7d5ec70e0e881e0106a81e43134bb01e4373533d43038600a8998c507975230303432b8324230bab3423e314ab343017085089d4dd8c08739950cc3533d733316080c983dcca44a25bd9c8d0c3087507d4fd66e6c9560626a91620f71b11723f3310f3a3848ba139b2fb99c9700b33f6b034c6e516be92c4823263bde292d41cbde4fc5c0639909b80380588034c98193a8419180c4a19181e4c6601d377581918125e41fc2c09c42d400bffffff5f0fc20caf54184e00c5804a18748066b340dda3e0c7c030219e11ac5f401de8d68c929282622b7dfd12bddc547d0606aee4fcbc92d48a92a4fc1206deb4fcd2a2e2c2d2c4a254109781233337311dc284182800b11b00d131fb71b0020000';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    const customLoader = (x, withOffset) => {
      const value = arrayBufferToHex(x);
      if (withOffset) {
        return {
          value,
          offset: x.byteLength,
        };
      }
      return value;
    };

    const load = R.partialRight(loadRpcResult, [customLoader]);

    it('without offset', () => {
      expect(load(buffer)).toMatchObject({
        reqMsgId: BigInt('6802566759015514128'),
        [TYPE_KEY]: RPC_RESULT_TYPE,
        [CONSTRUCTOR_KEY]: RPC_RESULT_CONSTRUCTOR,
      });
    });

    it('with offset', () => {
      expect(load(buffer, true)).toMatchObject({
        offset: 376,
        value: {
          reqMsgId: BigInt('6802566759015514128'),
          [TYPE_KEY]: RPC_RESULT_TYPE,
          [CONSTRUCTOR_KEY]: RPC_RESULT_CONSTRUCTOR,
        },
      });
    });
  });
});
