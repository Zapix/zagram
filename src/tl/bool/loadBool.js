import * as R from 'ramda';
/**
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
import { BOOL_TRUE } from '../../constants';
import { isWithOffset, withConstantOffset } from '../../utils';

function loadBool(buffer) {
  return (new Uint32Array(buffer, 0, 1))[0] === BOOL_TRUE;
}

export default R.cond([
  [isWithOffset, withConstantOffset(loadBool, 4)],
  [R.T, loadBool],
]);
