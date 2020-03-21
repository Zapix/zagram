import * as R from 'ramda';

import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';
import { MSGS_STATE_REQ } from '../../constants';

import { dumpVector } from '../vector';
import { dumpInt } from '../int';

const dumpConstructor = R.pipe(R.always(MSGS_STATE_REQ), dumpInt);
const dumpMsgIds = R.pipe(R.prop('msgIds'), dumpVector);

export default R.pipe(
  R.of,
  R.ap([dumpConstructor, dumpMsgIds]),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
);
