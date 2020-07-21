import * as R from 'ramda';
import { applyAll, getFirstByte, sliceBuffer } from '../../utils';
import BitString from './BitString';

const getBitPadding = getFirstByte;

export default R.pipe(
  applyAll([
    R.partialRight(sliceBuffer, [1]),
    getBitPadding,
  ]),
  ([buffer, padding]) => new BitString(buffer, padding),
);
