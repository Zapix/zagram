import * as R from 'ramda';

import { isWithOffset, uint8ToString } from '../../utils';
import { getStringFromArrayBuffer } from '../tlSerialization';

const tlStringWithOffset = R.unary(R.partialRight(getStringFromArrayBuffer, [0]));

const getString = R.pipe(
  R.prop('incomingString'),
  uint8ToString,
);

export default R.cond([
  [
    isWithOffset,
    R.pipe(
      tlStringWithOffset,
      (x) => ({
        value: getString(x),
        offset: R.prop('offset', x),
      }),
    ),
  ],
  [R.T, R.pipe(tlStringWithOffset, getString)],
]);
