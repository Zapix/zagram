import * as R from 'ramda';

import { isWithOffset, sliceBuffer, withConstantOffset } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import { MSG_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';

const loadMsgId = R.pipe(
  R.partialRight(sliceBuffer, [4, 12]),
  loadBigInt,
);

const loadAnswerMsgId = R.pipe(
  R.partialRight(sliceBuffer, [12, 20]),
  loadBigInt,
);

const loadBytes = R.pipe(
  R.partialRight(sliceBuffer, [20, 24]),
  loadInt,
);

const loadStatus = R.pipe(
  R.partialRight(sliceBuffer, [24, 28]),
  loadInt,
);

/**
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
const loadMsgDetailedInfo = R.pipe(
  R.of,
  R.ap([R.always(MSG_DETAILED_INFO_TYPE), loadMsgId, loadAnswerMsgId, loadBytes, loadStatus]),
  R.zipObj([TYPE_KEY, 'msgId', 'answerMsgId', 'bytes', 'status']),
);

export default R.cond([
  [isWithOffset, withConstantOffset(loadMsgDetailedInfo, 28)],
  [R.T, loadMsgDetailedInfo],
]);
