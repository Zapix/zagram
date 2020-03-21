import * as R from 'ramda';
import { isWithOffset, withConstantOffset } from '../../utils';

function loadInt(buffer) {
  return new Uint32Array(buffer, 0, 1)[0];
}

export default R.cond([
  [isWithOffset, withConstantOffset(loadInt, 4)],
  [R.T, loadInt],
]);
