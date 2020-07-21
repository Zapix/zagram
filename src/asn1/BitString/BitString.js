import * as R from 'ramda';

import {
  applyAll,
  arrayBufferToUint8Array,
  byteToStrBase2,
  getNBit,
  toArray,
} from '../../utils';

export default class BitString {
  /**
   * @param {ArrayBuffer} buffer
   * @param {Number} padding
   */
  constructor(buffer, padding) {
    this.buffer = buffer;
    this.padding = padding;
  }

  /**
   * @param {Number} nth - nth bit that should be read use higher-to-lower direction
   * @returns {Number|undefined}
   */
  getBit(nth) {
    if (nth < 0 || nth >= this.size) {
      return undefined;
    }
    const l2hIdx = this.size - (nth + 1);
    const currentByte = Math.floor(l2hIdx / 8);
    const currentBitId = 7 - (l2hIdx % 8);
    const uint8 = new Uint8Array(this.buffer);
    return getNBit(uint8[currentByte], currentBitId);
  }

  /**
   * @returns {Number} - size in bites
   */
  get size() {
    return this.buffer.byteLength * 8 - this.padding;
  }

  toString() {
    return R.pipe(
      applyAll([
        R.nth(0),
        R.pipe(
          R.nth(1),
          arrayBufferToUint8Array,
          toArray,
          R.map(byteToStrBase2),
          R.join(''),
        ),
      ]),
      R.apply(R.dropLast),
    )([this.padding, this.buffer]);
  }

  /**
   * @returns {ArrayBuffer} - array buffer of current bitstring
   */
  toArrayBuffer() {
    return this.buffer;
  }
}
