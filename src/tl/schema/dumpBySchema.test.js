import * as R from 'ramda';

import dumpBySchema from './dumpBySchema';
import layer108 from './layer108.json';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';

describe('dumpBySchema', () => {
  describe('layer 108 schema', () => {
    const dump = R.partial(dumpBySchema, [layer108]);

    it('auth.sentCode', () => {
      const obj = {
        [CONSTRUCTOR_KEY]: 'auth.sentCode',
        [TYPE_KEY]: 'auth.SentCode',
        type: {
          [CONSTRUCTOR_KEY]: 'auth.sentCodeTypeSms',
          [TYPE_KEY]: 'auth.SentCodeType',
          length: 4,
        },
        phone_code_hash: '1e838171e6c5729250',
        timeout: 1000,
      };

      const buffer = dump(obj);
      const hexStr = '0225005e04000000a2bb00c0040000001231653833383137316536633537323932353000e8030000';

      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });

    it('messageActionChatCreate', () => {
      const obj = {
        [CONSTRUCTOR_KEY]: 'messageActionChatCreate',
        [TYPE_KEY]: 'MessageAction',
        title: 'Hello World!',
        users: [2, 3, 4],
      };

      const buffer = dump(obj);

      /* eslint-disable */
      const hexStr = '9a8b63a60c48656c6c6f20576f726c642100000015c4b51c03000000020000000300000004000000'
      /* eslint-enable */

      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });

    it('codeSettings', () => {
      const obj = {
        [CONSTRUCTOR_KEY]: 'codeSettings',
        [TYPE_KEY]: 'CodeSettings',
        current_number: {
          [CONSTRUCTOR_KEY]: 'true',
          [TYPE_KEY]: 'True',
        },
        allow_app_hash: {
          [CONSTRUCTOR_KEY]: 'true',
          [TYPE_KEY]: 'True',
        },
      };

      const buffer = dump(obj);

      const hexStr = '83bebede1200000039d3ed3f39d3ed3f';
      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });

    it('dump by schema', () => {
      const obj = {
        [METHOD_KEY]: 'invokeWithLayer',
        [TYPE_KEY]: 'X',
        layer: 105,
        query: {
          [METHOD_KEY]: 'help.getConfig',
          [TYPE_KEY]: 'Config',
        },
      };

      const buffer = dump(obj);
      const hexStr = '0d0d9bda690000006b18f9c4';
      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });
  });
});
