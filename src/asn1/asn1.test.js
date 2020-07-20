import * as R from 'ramda';

import {
  decode,
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

describe('decode', () => {
  function testFunction({ type, buffer, value }) {
    it(`decode ${type}`, () => {
      expect(decode(hexToArrayBuffer(buffer))).toEqual(value);
    });
  }

  const testArray = [
    {
      type: 'Big Integer 126 bit',
      buffer: '02102FA176B36EE9F049F444B40099661945',
      value: BigInt('63312083136615639753586560173617846597'),
    },
    {
      type: 'Big Integer 1024 bit',
      /* eslint-disable */
      buffer: '028181008953097086EE6147C5F4D5FFAF1B498A3D11EC5518E964DC52126B2614F743883F64CA51377ABB530DFD20464A48BD67CD27E7B29AEC685C5D10825E605C056E4AB8EEA460FA27E55AA62C498B02D7247A249838A12ECDF37C6011CF4F0EDEA9CEE687C1CB4A51C6AE62B2EFDB000723A01C99D6C23F834880BA8B42D5414E6F',
      value: BigInt('635048724432704421127930570668665246853305382538324205739741643121831497295424070220821366244137115920753022123888627038218427491681054376713237422498116573180444839575827154645186734602336866679804832661256616738257119870932328599495025506292424741581222812593482590762754785441060866630543522468678295806775919446210955958208696766307578451905771148370694894591388931494246786732600822191966681852303750991082312180670980233382216493445574638820565887523903118457551295241540793541306271618874366356869335229283992012581380459991160410157116077111142487644315609688092841697874946124416376553323373756926990721842430477982958383467149331238064901788481621489266725616974850293388387825359434286033332681714766010619113405542747712973535303497912234899589502990216128180823653963322406352206636893824027962569732222882297210841939793442415179615290739900774082858983244011679281115202763730964934473392333219986431517733237277686866318351054204026883453068392486990840498271719737813876367239342153571643327128417739316281558041652406500713712661305061745568036561978158652008943224271511931676512028205883718704503533046383542018858616087454820845906934069146870330990447993387221061968484774662499598623702280426558025111180066917'),
      /* eslint-enable */
    },
    {
      type: 'Padded 127',
      buffer: '0202007F',
      value: BigInt(127),
    },
    {
      type: 'Negative 129',
      buffer: '0202FF7F',
      value: BigInt(-129),
    },
    {
      type: 'Negative 1000 (2)',
      buffer: '0202FC18',
      value: BigInt(-1000),
    },
    {
      type: 'Negative 1000 (4)',
      buffer: '0204FFFFFC18',
      value: BigInt(-1000),
    },
    {
      type: 'Negative 1000 (8)',
      buffer: '0208FFFFFFFFFFFFFC18',
      value: BigInt(-1000),
    },
    {
      type: 'Negative 1000 (16)',
      buffer: '0210FFFFFFFFFFFFFFFFFFFFFFFFFFFFFC18',
      value: BigInt(-1000),
    },
    {
      type: 'Negative 8388607',
      buffer: '0203800001',
      value: BigInt(-8388607),
    },
    {
      type: 'Zero (2)',
      buffer: '02020000',
      value: BigInt('0'),
    },
    {
      type: 'Negative 1 (4)',
      buffer: '0204FFFFFFFF',
      value: BigInt('-1'),
    },
  ];

  R.forEach(testFunction, testArray);
});
