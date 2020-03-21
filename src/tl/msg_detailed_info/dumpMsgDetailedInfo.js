import * as R from 'ramda';

import { MSG_DETAILED_INFO } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';

const dumpConstructor = R.pipe(R.always(MSG_DETAILED_INFO), dumpInt);
const dumpMsgId = R.pipe(R.prop('msgId'), dumpBigInt);
const dumpAnswerMsgId = R.pipe(R.prop('answerMsgId'), dumpBigInt);
const dumpBytes = R.pipe(R.prop('bytes'), dumpInt);
const dumpStatus = R.pipe(R.prop('status'), dumpInt);

/**
 * @param {*} value
 * @returns {ArrayBuffer}
 */
export default R.pipe(
  R.of,
  R.ap([dumpConstructor, dumpMsgId, dumpAnswerMsgId, dumpBytes, dumpStatus]),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
);
