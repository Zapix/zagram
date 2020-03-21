import dumpVector from './dumpVector';
import loadVector from './loadVector';

import { loadBool } from '../bool';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';
import { loadString } from '../string';
import { arrayBufferToHex, hexToArrayBuffer } from '../../utils';

describe('dumpVector', () => {
  it('of bool', () => {
    const buffer = dumpVector([true, false, true, true]);
    expect(loadVector(loadBool, buffer)).toEqual([true, false, true, true]);
  });

  it('of int', () => {
    const buffer = dumpVector([3, 1, 3, 3, 7, 42]);
    expect(loadVector(loadInt, buffer)).toEqual([3, 1, 3, 3, 7, 42]);
  });

  it('of bigint', () => {
    const buffer = dumpVector([BigInt('2019'), BigInt('2020')]);
    expect(loadVector(loadBigInt, buffer)).toEqual([BigInt('2019'), BigInt('2020')]);
  });

  it('of string', () => {
    const buffer = dumpVector(['Hello', 'MTProto', 'implementation']);
    expect(loadVector(loadString, buffer)).toEqual(['Hello', 'MTProto', 'implementation']);
  });

  it('dump with custom dumpFunction function', () => {
    const dump = jest.fn();
    dump.mockReturnValueOnce(hexToArrayBuffer('11111111'));
    dump.mockReturnValueOnce(hexToArrayBuffer('22222222'));

    const buffer = dumpVector(dump, [1, 2]);

    // 0x1c b5 c4 15
    const hexStr = '15c4b51c020000001111111122222222';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
