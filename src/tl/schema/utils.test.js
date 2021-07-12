import {
  intToUint,
  getParseSchemaById,
  isFromSchemaFactory,
  getSchemaForMethod,
  getSchemaForConstructor,
  loadFlag,
  dumpFlag, hasConditionalField,
} from './utils';

import schema from './layer108.json';
import echoSchema from './echo.json';
import { hexToArrayBuffer } from '../../utils';

describe('utils', () => {
  describe('intToUint', () => {
    test('571849917', () => {
      expect(intToUint(571849917)).toEqual(0x2215bcbd);
    });

    test('-486486981', () => {
      expect(intToUint(-486486981)).toEqual(0xe300cc3b);
    });

    test('1988976461', () => {
      expect(intToUint(1988976461)).toEqual(0x768d5f4d);
    });
  });

  describe('getParseSchemaByid', () => {
    describe('schema parser', () => {
      test('find for constructor', () => {
        expect(getParseSchemaById(schema, 0x5e002502)).toEqual({
          id: 0x5e002502,
          predicate: 'auth.sentCode',
          params: [
            {
              name: 'flags',
              type: '#',
            },
            {
              name: 'type',
              type: 'auth.SentCodeType',
            },
            {
              name: 'phone_code_hash',
              type: 'string',
            },
            {
              name: 'next_type',
              type: 'flags.1?auth.CodeType',
            },
            {
              name: 'timeout',
              type: 'flags.2?int',
            },
          ],
          type: 'auth.SentCode',
        });
      });

      test('find for constructor with uint', () => {
        expect(getParseSchemaById(schema, 0x1e287d04)).toEqual({
          id: 0x1e287d04,
          predicate: 'inputMediaUploadedPhoto',
          params: [
            {
              name: 'flags',
              type: '#',
            },
            {
              name: 'file',
              type: 'InputFile',
            },
            {
              name: 'stickers',
              type: 'flags.0?Vector<InputDocument>',
            },
            {
              name: 'ttl_seconds',
              type: 'flags.1?int',
            },
          ],
          type: 'InputMedia',
        });
      });

      test('find for method', () => {
        expect(getParseSchemaById(schema, 0xa677244f)).toEqual({
          id: 0xa677244f,
          method: 'auth.sendCode',
          params: [
            {
              name: 'phone_number',
              type: 'string',
            },
            {
              name: 'api_id',
              type: 'int',
            },
            {
              name: 'api_hash',
              type: 'string',
            },
            {
              name: 'settings',
              type: 'CodeSettings',
            },
          ],
          type: 'auth.SentCode',
        });
      });

      test('echo schema parser', () => {
        expect(getParseSchemaById(echoSchema, 0x0d6a003e)).toEqual({
          id: 225050686,
          predicate: 'reply',
          params: [
            {
              name: 'rand_id',
              type: 'int',
            },
            {
              name: 'content',
              type: 'string',
            },
          ],
          type: 'Reply',
        });
      });

      test('not found', () => {
        expect(getParseSchemaById(schema, 0x00110000)).toBeUndefined();
      });
    });
  });

  describe.skip('isFromSchemaFactory', () => {
    describe('layer schema', () => {
      const isLoadableBySchema = isFromSchemaFactory(schema);
      test('found constructor', () => {
        const buffer = hexToArrayBuffer('047d281e');
        expect(isLoadableBySchema(buffer)).toEqual(true);
      });

      test('found method', () => {
        const buffer = hexToArrayBuffer('4f2477a6');
        expect(isLoadableBySchema(buffer)).toEqual(true);
      });
    });
  });

  describe.skip('getSchemaForMethod', () => {
    it('layer schema', () => {
      expect(getSchemaForMethod(schema, 'auth.sendCode')).toEqual({
        id: 0xa677244f,
        method: 'auth.sendCode',
        params: [
          {
            name: 'phone_number',
            type: 'string',
          },
          {
            name: 'api_id',
            type: 'int',
          },
          {
            name: 'api_hash',
            type: 'string',
          },
          {
            name: 'settings',
            type: 'CodeSettings',
          },
        ],
        type: 'auth.SentCode',
      });
    });
  });

  describe.skip('getSchemaForConstructor', () => {
    describe('layer schema', () => {
      expect(getSchemaForConstructor(schema, 'photos.photosSlice')).toEqual({
        id: 352657236,
        predicate: 'photos.photosSlice',
        params: [
          {
            name: 'count',
            type: 'int',
          },
          {
            name: 'photos',
            type: 'Vector<Photo>',
          },
          {
            name: 'users',
            type: 'Vector<User>',
          },
        ],
        type: 'photos.Photos',
      });
    });
  });

  it('loadFlag', () => {
    expect(loadFlag(14381)).toEqual(
      /* eslint-disable */
      [true, false, true, true, false, true, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
      /* eslint-enable */
    );
  });

  it('dumpFlag', () => {
    expect(dumpFlag(
      /* eslint-disable */
      [true, false, true, true, false, true, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
      /* eslint-enable */
    )).toEqual(14381);
  });

  describe.skip('hasConditionalField', () => {
    it('has', () => {
      expect(hasConditionalField({
        id: '1355435489',
        predicate: 'phoneCallDiscarded',
        params: [
          {
            name: 'flags',
            type: '#',
          },
          {
            name: 'need_rating',
            type: 'flags.2?true',
          },
          {
            name: 'need_debug',
            type: 'flags.3?true',
          },
          {
            name: 'video',
            type: 'flags.5?true',
          },
          {
            name: 'id',
            type: 'long',
          },
          {
            name: 'reason',
            type: 'flags.0?PhoneCallDiscardReason',
          },
          {
            name: 'duration',
            type: 'flags.1?int',
          },
        ],
        type: 'PhoneCall',
      })).toEqual(true);
    });

    it('hasn`t', () => {
      expect(hasConditionalField({
        id: '1355435489',
        predicate: 'phoneCallDiscarded',
        params: [
          {
            name: 'need_rating',
            type: 'flags.2?true',
          },
          {
            name: 'need_debug',
            type: 'flags.3?true',
          },
          {
            name: 'video',
            type: 'flags.5?true',
          },
          {
            name: 'id',
            type: 'long',
          },
          {
            name: 'reason',
            type: 'flags.0?PhoneCallDiscardReason',
          },
          {
            name: 'duration',
            type: 'flags.1?int',
          },
        ],
        type: 'PhoneCall',
      })).toEqual(false);
    });
  });
});
