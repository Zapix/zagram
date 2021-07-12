import * as R from 'ramda';
import { hexToArrayBuffer } from '../../utils';

import layer108 from './layer108.json';
import echoSchema from './echo.json';

import loadBySchema from './loadBySchema';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';

describe('loadBySchema layer108', () => {
  describe.skip('user api layer 108', () => {
    const load = R.partial(loadBySchema, [layer108]);

    describe('auth.sentCode', () => {
      /* eslint-disable */
      const hexStr = '0225005e04000000a2bb00c0040000001231653833383137316536633537323932353000e8030000';
      /* eslint-enable */
      const buffer = hexToArrayBuffer(hexStr);

      it('without offset', () => {
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

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          value: {
            [CONSTRUCTOR_KEY]: 'auth.sentCode',
            [TYPE_KEY]: 'auth.SentCode',
            type: {
              [CONSTRUCTOR_KEY]: 'auth.sentCodeTypeSms',
              [TYPE_KEY]: 'auth.SentCodeType',
              length: 4,
            },
            phone_code_hash: '1e838171e6c5729250',
            timeout: 1000,
          },
          offset: 40,
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
      const hexStr = '67400b33480e00006e92675e079f675eb57572990200000015c4b51c0a0000000da1b71804040000010000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71810000000010000000e3134392e3135342e3137352e313000500000000da1b718010000000100000027323030313a306232383a663233643a663030313a303030303a303030303a303030303a30303065bb0100000da1b71810000000020000000e3134392e3135342e3136372e343000bb0100000da1b71804040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b71806040000020000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000200000027323030313a303637633a303465383a663030323a303030303a303030303a303030303a30303065bb0100000da1b71810000000030000000f3134392e3135342e3137352e313137bb0100000da1b71804040000030000000e3230372e3135342e3234312e373300cf38000011ddfdda254c78d9fa202ac536079e88b80800000da1b718010000000300000027323030313a306232383a663233643a663030333a303030303a303030303a303030303a30303065bb0100000e74617076332e7374656c2e636f6d001e0000000f00000064000000503403008813000030750000e093040030750000dc05000060ea0000020000001900000084030000ffffff7fffffff7f00ea2400c8000000050000002c0100000400000003000000204e0000905f010030750000102700000d68747470733a2f2f742e6d652f00000a636f6e74657874626f74000d666f7572737175617265626f74000008696d616765626f74000000000400000010000002000000';
      /* eslint-enable */
      const buffer = hexToArrayBuffer(hexStr);

      it('without offset', () => {
        expect(load(buffer)).toMatchObject({
          [CONSTRUCTOR_KEY]: 'config',
          [TYPE_KEY]: 'Config',
        });
      });

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          value: expect.objectContaining({
            [CONSTRUCTOR_KEY]: 'config',
            [TYPE_KEY]: 'Config',
            blocked_mode: expect.any(Boolean),
            phonecalls_enabled: expect.any(Boolean),
          }),
          offset: 688,
        });
      });
    });

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

  describe('mtproto echo server api layer', () => {
    const load = R.partial(loadBySchema, [echoSchema]);

    describe('reply', () => {
      const hexStr = '3e006a0d430000000b68656c6c6f20776f726c64';
      const buffer = hexToArrayBuffer(hexStr);

      it('without offset', () => {
        expect(load(buffer)).toEqual({
          [TYPE_KEY]: 'Reply',
          [CONSTRUCTOR_KEY]: 'reply',
          content: 'hello world',
          rand_id: 67,
        });
      });

      it('with offset', () => {
        expect(load(buffer, true)).toEqual({
          value: {
            [TYPE_KEY]: 'Reply',
            [CONSTRUCTOR_KEY]: 'reply',
            content: 'hello world',
            rand_id: 67,
          },
          offset: 20,
        });
      });
    });
  });
});
