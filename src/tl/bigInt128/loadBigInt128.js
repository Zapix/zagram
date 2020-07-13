import * as R from 'ramda';
import { isWithOffset, withConstantOffset } from '../../utils';
import { add, getBase, toBigInt } from '../utils';

function loadBytes(buffer) {
  return Array.from(new Uint8Array(buffer, 0, 16));
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {BigInt}
 */
const loadBigInt128 = R.pipe(
  loadBytes,
  R.map(toBigInt),
  getBase,
  R.map(R.apply(R.multiply)),
  R.reduce(add, BigInt(0)),
);

export default R.cond([
  [isWithOffset, withConstantOffset(loadBigInt128, 16)],
  [R.T, loadBigInt128],
]);
