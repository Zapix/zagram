import * as R from 'ramda';
import loadVector from './loadVector';
import { copyBytes, hexToArrayBuffer } from '../../utils';
import { loadInt } from '../int';
import { stringToTlString } from '../tlSerialization';
import { VECTOR } from '../../constants';
import { loadString } from '../string';

describe('loadVector', () => {
  describe('load vector of ints', () => {
    const hexStr = '15c4b51c03000000020000000300000004000000';
    const buffer = hexToArrayBuffer(hexStr);

    it('load vector without offset', () => {
      expect(loadVector(loadInt, buffer)).toEqual([2, 3, 4]);
    });

    it('load vector with offset', () => {
      expect(loadVector(loadInt, buffer, true)).toEqual({
        offset: buffer.byteLength,
        value: [2, 3, 4],
      });
    });
  });

  describe('load vector of strings', () => {
    const strings = [
      'hello',
      'world',
      'telegram',
    ];

    const stringsBytes = R.pipe(
      R.map(stringToTlString),
      R.flatten,
    )(strings);
    const buffer = new ArrayBuffer(8 + stringsBytes.length);
    const constructor = new Uint32Array(buffer, 0, 1);
    constructor[0] = VECTOR;
    const lengthView = new Uint32Array(buffer, 4, 1);
    lengthView[0] = strings.length;
    const bufferStringsView = new Uint8Array(buffer, 8);
    copyBytes(stringsBytes, bufferStringsView);

    it('without offset', () => {
      expect(loadVector(loadString, buffer)).toEqual(strings);
    });

    it('with offset', () => {
      expect(loadVector(loadString, buffer, true)).toEqual({
        value: strings,
        offset: buffer.byteLength,
      });
    });
  });
});
