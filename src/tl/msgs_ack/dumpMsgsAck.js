import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpVector } from '../vector';
import { MSGS_ACK } from '../../constants';
import { mergeArrayBuffer } from '../../utils';

export default R.pipe(
  R.of,
  R.ap([
    R.always(dumpInt(MSGS_ACK)),
    R.pipe(R.prop('msgIds'), dumpVector),
  ]),
  R.apply(mergeArrayBuffer),
);
