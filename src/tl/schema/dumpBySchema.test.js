import * as R from 'ramda';

import dumpBySchema from './dumpBySchema';
import layer5 from './layer5.json';
import layer108 from './layer108.json';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';

describe('dumpBySchema', () => {
  describe('layer 5 schema', () => {
    const dump = R.partial(dumpBySchema, [layer5]);
    it('auth.sendCode', () => {
      const obj = {
        [TYPE_KEY]: 'auth.SentCode',
        [METHOD_KEY]: 'auth.sendCode',
        phone_number: '+79625213997',
        sms_type: 0,
        api_id: 1005944,
        api_hash: 'dfbf8ed1e37d1cd1ad370e7431ed8a87',
        lang_code: 'ru-ru',
      };

      const buffer = dump(obj);
      /* eslint-disable */
      const hexStr = '4d5f8d760c2b37393632353231333939370000000000000078590f002064666266386564316533376431636431616433373065373433316564386138370000000572752d72750000';
      /* eslint-enable */

      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });


    it('auth.sentCode', () => {
      const obj = {
        [CONSTRUCTOR_KEY]: 'auth.sentCode',
        [TYPE_KEY]: 'auth.SentCode',
        phone_registered: true,
        phone_code_hash: '1e838171e6c5729250',
      };

      const buffer = dump(obj);
      const hexStr = 'bdbc1522b57572991231653833383137316536633537323932353000';

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
      const hexStr = '9a8b63a60c48656c6c6f20576f726c642100000015c4b51c03000000020000000300000004000000';
      /* eslint-enable */

      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });

    it('config', () => {
      const obj = {
        [CONSTRUCTOR_KEY]: 'config',
        [TYPE_KEY]: 'Config',
        date: 0x5e4d780f,
        test_mode: true,
        this_dc: 2,
        dc_options: [
          {
            [CONSTRUCTOR_KEY]: 'dcOption',
            [TYPE_KEY]: 'DcOption',
            id: 1,
            hostname: '',
            port: 80,
            ip_address: '149.154.175.10',
          },
        ],
        chat_size_max: 0x1e,
      };

      const buffer = dump(obj);

      /* eslint-disable */
      const hexStr = '05592d230f784d5eb57572990200000015c4b51c010000003ca4c22e01000000000000000e3134392e3135342e3137352e313000500000001e000000';
      /* eslint-enable */

      expect(arrayBufferToHex(buffer)).toEqual(hexStr);
    });
  });

  describe('layer 108 schema', () => {
    const dump = R.partial(dumpBySchema, [layer108]);
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
