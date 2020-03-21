import * as R from 'ramda';
import { MSG_NEW_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';
import { isWithOffset, sliceBuffer, withConstantOffset } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';

const loadType = R.pipe(R.always(MSG_NEW_DETAILED_INFO_TYPE));
const loadAnswerMsgId = R.pipe(R.partialRight(sliceBuffer, [4, 12]), loadBigInt);
const loadBytes = R.pipe(R.partialRight(sliceBuffer, [12, 16]), loadInt);
const loadStatus = R.pipe(R.partialRight(sliceBuffer, [16, 20]), loadInt);

/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {{}}
 */
const loadMsgNewDetailInfo = R.pipe(
  R.of,
  R.ap([loadType, loadAnswerMsgId, loadBytes, loadStatus]),
  R.zipObj([TYPE_KEY, 'answerMsgId', 'bytes', 'status']),
);

export default R.cond([
  [isWithOffset, withConstantOffset(loadMsgNewDetailInfo, 20)],
  [R.T, loadMsgNewDetailInfo],
]);
