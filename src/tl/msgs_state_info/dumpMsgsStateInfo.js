import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { toTlString } from '../tlSerialization';
import { getEmptyArrayBuffer, mergeArrayBuffer, uint8ToArrayBuffer } from '../../utils';
import { MSGS_STATE_INFO } from '../../constants';

const dumpConstructor = R.pipe(R.always(MSGS_STATE_INFO), dumpInt);
const dumpReqMsgId = R.pipe(R.prop('reqMsgId'), dumpBigInt);
const dumpInfo = R.pipe(
  R.prop('info'),
  toTlString,
  uint8ToArrayBuffer,
);

export default R.pipe(
  R.of,
  R.ap([dumpConstructor, dumpReqMsgId, dumpInfo]),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
);
