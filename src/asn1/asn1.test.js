import * as R from 'ramda';

import {
  decodeBlockHeader,
  getBlockClass, getBlockLength,
} from './asn1';
import { hexToArrayBuffer, uint8ToArrayBuffer } from '../utils';

describe('getBlockClass', () => {
  function testFunc({ type, value }) {
    it(`block class ${type}`, () => {
      expect(getBlockClass(value)).toEqual(type);
    });
  }

  const testValues = [
    {
      type: 'UNIVERSAL',
      value: uint8ToArrayBuffer([0b00000010]),
    },
    {
      type: 'APPLICATION',
      value: uint8ToArrayBuffer([0b01000010]),
    },
    {
      type: 'CONTEXT-SPECIFIC',
      value: uint8ToArrayBuffer([0b10000010]),
    },
    {
      type: 'PRIVATE',
      value: uint8ToArrayBuffer([0b11000010]),
    },
  ];

  R.forEach(testFunc, testValues);
});

describe('decodeBlockHeader', () => {
  function testFunc({ type, buffer, value }) {
    it(`decode block header for ${type}`, () => {
      expect(decodeBlockHeader(buffer)).toEqual(value);
    });
  }

  const valueArray = [
    {
      type: 'int',
      buffer: hexToArrayBuffer('02017F'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 2,
          blockIdName: 'int',
          multiValue: false,
        },
        offset: 1,
      },
    },
    {
      type: 'real',
      buffer: hexToArrayBuffer('090380fb05'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 9,
          blockIdName: 'real',
          multiValue: false,
        },
        offset: 1,
      },
    },
    {
      type: 'OID',
      buffer: hexToArrayBuffer('060488378952'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 6,
          blockIdName: 'OID',
          multiValue: false,
        },
        offset: 1,
      },
    },
    {
      type: 'bit string',
      buffer: hexToArrayBuffer('0304066E5DC0'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 3,
          blockIdName: 'BitString',
          multiValue: false,
        },
        offset: 1,
      },
    },
    {
      type: 'OctetString',
      buffer: hexToArrayBuffer('04080123456789ABCDEF'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 4,
          blockIdName: 'OctetString',
          multiValue: false,
        },
        offset: 1,
      },
    },
    {
      type: 'sequence',
      buffer: hexToArrayBuffer('3082010A'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 0b10000,
          blockIdName: 'sequence',
          multiValue: true,
        },
        offset: 1,
      },
    },
    {
      type: 'with long block id header',
      buffer: hexToArrayBuffer('1f8a8b14'),
      value: {
        value: {
          blockClass: 'UNIVERSAL',
          blockId: 162707,
          blockIdName: 'unknown',
          multiValue: false,
        },
        offset: 4,
      },
    },
  ];

  R.forEach(testFunc, valueArray);
});

describe('getBlockLength', () => {
  function testFunction({ type, buffer, value }) {
    it(`get length for ${type}`, () => {
      expect(getBlockLength(buffer)).toEqual(value);
    });
  }

  const testArray = [
    {
      type: '820122: length 290, offset 3',
      buffer: hexToArrayBuffer('820122'),
      value: {
        value: 290,
        offset: 3,
      },
    },
    {
      type: '04: length 4, offset 1',
      buffer: hexToArrayBuffer('04'),
      value: {
        value: 4,
        offset: 1,
      },
    },
    {
      type: '820201: length 513, offset 3',
      buffer: hexToArrayBuffer('820201'),
      value: {
        value: 513,
        offset: 3,
      },
    },
  ];

  R.forEach(testFunction, testArray);
});
