import * as R from 'ramda';
import { hexToArrayBuffer } from '../../utils';

import layer5 from './layer5.json';
import layer108 from './layer108.json';

import loadBySchema from './loadBySchema';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';

describe('loadBySchema', () => {
  describe('user api layer 5', () => {
    const load = R.partial(loadBySchema, [layer5]);
    describe('auth.sentCode', () => {
      const hexStr = 'bdbc1522b57572991231653833383137316536633537323932353000';
      const arrayBuffer = hexToArrayBuffer(hexStr);

      it('load without offset', () => {
        expect(load(arrayBuffer)).toMatchObject({
          [CONSTRUCTOR_KEY]: 'auth.sentCode',
          [TYPE_KEY]: 'auth.SentCode',
          phone_registered: true,
          phone_code_hash: '1e838171e6c5729250',
        });
      });

      it('load with offset', () => {
        expect(load(arrayBuffer, true)).toEqual({
          value: {
            [CONSTRUCTOR_KEY]: 'auth.sentCode',
            [TYPE_KEY]: 'auth.SentCode',
            phone_registered: true,
            phone_code_hash: '1e838171e6c5729250',
          },
          offset: 28,
        });
      });
    });

    describe('messageActionChatCreate', () => {
      /* eslint-disable */
      const hexStr = '9a8b63a60c48656c6c6f20576f726c642100000015c4b51c03000000020000000300000004000000';
      /* eslint-enable */
      const buffer = hexToArrayBuffer(hexStr);


      it('without offset', () => {
        expect(load(buffer)).toEqual({
          [CONSTRUCTOR_KEY]: 'messageActionChatCreate',
          [TYPE_KEY]: 'MessageAction',
          title: 'Hello World!',
          users: [2, 3, 4],
        });
      });

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          value: {
            [CONSTRUCTOR_KEY]: 'messageActionChatCreate',
            [TYPE_KEY]: 'MessageAction',
            title: 'Hello World!',
            users: [2, 3, 4],
          },
          offset: 40,
        });
      });
    });

    describe('config', () => {
      /* eslint-disable */
      const hexStr = '05592d230f784d5eb57572990200000015c4b51c010000003ca4c22e01000000000000000e3134392e3135342e3137352e313000500000001e000000';
      /* eslint-enable */
      const buffer = hexToArrayBuffer(hexStr);

      it('without offset', () => {
        expect(load(buffer)).toEqual({
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
        });
      });

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          value: {
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
          },
          offset: 60,
        });
      });
    });
  });
  describe('user api layer 108', () => {
    const load = R.partial(loadBySchema, [layer108]);
    describe('codeSettings', () => {
      describe('2 flags on', () => {
        const hexStr = '83bebede12000000';
        const buffer = hexToArrayBuffer(hexStr);

        it('without offset', () => {
          expect(load(buffer)).toEqual({
            [CONSTRUCTOR_KEY]: 'codeSettings',
            [TYPE_KEY]: 'CodeSettings',
            current_number: true,
            allow_flashcall: false,
            allow_app_hash: true,
          });
        });

        it('with offset', () => {
          expect(load(buffer, true)).toEqual({
            value: {
              [CONSTRUCTOR_KEY]: 'codeSettings',
              [TYPE_KEY]: 'CodeSettings',
              current_number: true,
              allow_flashcall: false,
              allow_app_hash: true,
            },
            offset: 8,
          });
        });
      });
    });

    describe('invoke with layer 108 get config', () => {
      const hexStr = '0d0d9bda690000006b18f9c4';
      const buffer = hexToArrayBuffer(hexStr);
      it('without offset', () => {
        expect(load(buffer)).toEqual({
          [METHOD_KEY]: 'invokeWithLayer',
          [TYPE_KEY]: 'X',
          layer: 105,
          query: {
            [METHOD_KEY]: 'help.getConfig',
            [TYPE_KEY]: 'Config',
          },
        });
      });

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          offset: 12,
          value: {
            [METHOD_KEY]: 'invokeWithLayer',
            [TYPE_KEY]: 'X',
            layer: 105,
            query: {
              [METHOD_KEY]: 'help.getConfig',
              [TYPE_KEY]: 'Config',
            },
          },
        });
      });
    });
  });
});
