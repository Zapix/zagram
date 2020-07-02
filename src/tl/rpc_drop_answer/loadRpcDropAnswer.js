import {
  METHOD_KEY,
  RPC_DROP_ANSWER_METHOD,
  RPC_DROP_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';
import { buildTypeLoader, buildLoadFunc, buildMethodLoader } from '../../utils';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(RPC_DROP_ANSWER_TYPE);
const loadMethod = buildMethodLoader(RPC_DROP_ANSWER_METHOD);
const loadReqMsgId = loadBigInt;

/**
 * rpc_drop_answer#58e4a740 req_msg_id:long = RpcDropAnswer;
 *
 * @param {ArrayBuffer} buffer
 * @param {boolean}  withOffset
 * @return {*}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['reqMsgId', loadReqMsgId],
]);
