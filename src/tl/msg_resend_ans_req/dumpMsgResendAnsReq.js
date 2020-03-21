import * as R from 'ramda';

import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';
import { MSG_RESEND_ANS_REQ } from '../../constants';
import { dumpVector } from '../vector';
import { dumpInt } from '../int';

const dumpConstructor = R.pipe(R.always(MSG_RESEND_ANS_REQ), dumpInt);
const dumpMsgIds = R.pipe(R.prop('msgIds'), dumpVector);

/**
 * @param {*} msg
 * @returns {ArrayBuffer}
 */
export default R.pipe(
  R.of,
  R.ap([dumpConstructor, dumpMsgIds]),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
);
