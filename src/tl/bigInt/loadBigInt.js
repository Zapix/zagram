import * as R from 'ramda';
import { isWithOffset, withConstantOffset } from '../../utils';

/**
 * @param {ArrayBuffer} buffer
 * @returns {BigInt}
 */
function loadBigInt(buffer) {
  return (new BigUint64Array(buffer, 0, 1))[0];
}

export default R.cond([
  [isWithOffset, withConstantOffset(loadBigInt, 8)],
  [R.T, loadBigInt],
]);
