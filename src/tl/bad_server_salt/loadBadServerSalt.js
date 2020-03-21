import * as R from 'ramda';
import { isWithOffset, sliceBuffer, withConstantOffset } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import { BAD_SERVER_SALT_TYPE, TYPE_KEY } from '../../constants';

const getMsgId = R.pipe(
  R.partialRight(sliceBuffer, [4, 12]),
  loadBigInt,
);

const getSeqNo = R.pipe(
  R.partialRight(sliceBuffer, [12, 16]),
  loadInt,
);

const getErrorCode = R.pipe(
  R.partialRight(sliceBuffer, [16, 20]),
  loadInt,
);

const getNewServerSalt = R.pipe(
  R.partialRight(sliceBuffer, [20, 28]),
  loadBigInt,
);

/**
 * @param {ArrayBuffer} buffer
 * @returns {*} - loaded message
 */
const loadBadServerSalt = R.pipe(
  R.of,
  R.ap([R.always(BAD_SERVER_SALT_TYPE), getMsgId, getSeqNo, getErrorCode, getNewServerSalt]),
  R.zipObj([TYPE_KEY, 'badMsgId', 'badSeqNo', 'errorCode', 'newServerSalt']),
);

export default R.cond([
  [isWithOffset, withConstantOffset(loadBadServerSalt, 28)],
  [R.T, loadBadServerSalt],
]);
