import * as R from 'ramda';
import { RPC_ANSWER_DROPPED_TYPE, TYPE_KEY } from '../../constants';
import { isWithOffset, sliceBuffer, withConstantOffset } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';


const getType = R.always(RPC_ANSWER_DROPPED_TYPE);
const getMsgId = R.pipe(R.partialRight(sliceBuffer, [4, 12]), loadBigInt);
const getSeqNo = R.pipe(R.partialRight(sliceBuffer, [12, 16]), loadInt);
const getBytes = R.pipe(R.partialRight(sliceBuffer, [16, 20]), loadInt);

const loadRpcAnswerDropped = R.pipe(
  R.of,
  R.ap([getType, getMsgId, getSeqNo, getBytes]),
  R.zipObj([TYPE_KEY, 'msgId', 'seqNo', 'bytes']),
);

/**
 * rpc_answer_dropped#a43ad8b7 msg_id:long seq_no:int bytes:int = RpcDropAnswer;
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset]
 * @returns {{}}
 */
export default R.cond([
  [isWithOffset, withConstantOffset(loadRpcAnswerDropped, 20)],
  [R.T, loadRpcAnswerDropped],
]);
