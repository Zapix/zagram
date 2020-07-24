import * as R from 'ramda';

import BitString from './BitString';
import { hexToArrayBuffer } from '../../utils';

describe('BitString', () => {
  const bitString = new BitString(hexToArrayBuffer('6E5DE0'), 6);
  it('size', () => {
    expect(bitString.size).toEqual(18);
  });

  it('toString', () => {
    expect(bitString.toString()).toEqual('011011100101110111');
  });

  describe('get bit', () => {
    function testFunc(val, idx) {
      it(`bit in ${idx}th place`, () => {
        expect(bitString.getBit(idx)).toEqual(val);
      });
    }

    const h2lbits = [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0];

    const forEachWithIdx = R.addIndex(R.forEach);
    forEachWithIdx(testFunc, h2lbits);
  });
});
