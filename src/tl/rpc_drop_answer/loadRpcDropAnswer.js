import * as R from 'ramda';

import { RPC_DROP_ANSWER_TYPE, TYPE_KEY } from '../../constants';
import { isWithOffset, sliceBuffer, withConstantOffset } from '../../utils';
import { loadBigInt } from '../bigInt';

const loadType = R.always(RPC_DROP_ANSWER_TYPE);
const loadReqMsgId = R.pipe(R.partialRight(sliceBuffer, [4, 12]), loadBigInt);

const loadRpcDropAnswer = R.pipe(
  R.of,
  R.ap([loadType, loadReqMsgId]),
  R.zipObj([TYPE_KEY, 'reqMsgId']),
);

/**
 * rpc_drop_answer#58e4a740 req_msg_id:long = RpcDropAnswer;
 *
 * @param {ArrayBuffer} buffer
 * @param {boolean}  withOffset
 * @return {*}
 */
export default R.cond([
  [isWithOffset, withConstantOffset(loadRpcDropAnswer, 12)],
  [R.T, loadRpcDropAnswer],
]);
