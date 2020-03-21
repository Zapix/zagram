import * as R from 'ramda';

import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';
import { RPC_RESULT } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(RPC_RESULT), dumpInt);
const dumpMsgId = R.pipe(R.prop('msgId'), dumpBigInt);

const buildDumpResultFunc = R.curry(R.binary(R.pipe))(R.prop('result'));

const buildDumpFuncs = R.pipe(
  R.nth(-1),
  R.of,
  R.ap([R.always(dumpType), R.always(dumpMsgId), buildDumpResultFunc]),
);

export default R.unapply(R.pipe(
  R.of,
  R.ap([
    buildDumpFuncs,
    R.pipe(R.nth(0), R.of),
  ]),
  R.apply(R.ap),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
));
