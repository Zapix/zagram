import * as R from 'ramda';
import {
  applyAll,
  arrayBufferToUint8Array,
  bigIntToUint8Array,
  powModulo, uint8ToArrayBuffer,
  uint8ToBigInt,
} from './utils';
/**
 *
 * @param {ArrayBuffer} origin - message as array buffer that should be encoded
 * @param {{ n: BigInt, e: BigInt }} pubKey - public keys that applied for encoding
 * @returns {ArrayBuffer} - encoded result
 */
export default R.unapply(R.pipe(
  applyAll([
    R.pipe(R.nth(0), arrayBufferToUint8Array, uint8ToBigInt),
    R.pipe(R.nth(1), R.prop('e')),
    R.pipe(R.nth(1), R.prop('n')),
  ]),
  R.apply(powModulo),
  bigIntToUint8Array,
  uint8ToArrayBuffer,
));
