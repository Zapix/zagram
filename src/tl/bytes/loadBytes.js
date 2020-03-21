import * as R from 'ramda';

import { getStringFromArrayBuffer } from '../tlSerialization';
import { isWithOffset } from '../../utils';

const loadBytes = R.pipe(
  R.nthArg(0),
  R.partialRight(getStringFromArrayBuffer, [0]),
);

const toArray = (x) => Array.from(x);

const incomingStringToArray = R.pipe(R.prop('incomingString'), toArray);

const toWithOffset = R.pipe(
  R.of,
  R.ap([incomingStringToArray, R.prop('offset')]),
  R.zipObj(['value', 'offset']),
);

export default R.cond([
  [isWithOffset, R.pipe(loadBytes, toWithOffset)],
  [R.T, R.pipe(loadBytes, incomingStringToArray)],
]);
