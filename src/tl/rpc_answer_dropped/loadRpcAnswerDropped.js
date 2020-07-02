import {
  CONSTRUCTOR_KEY,
  RPC_ANSWER_DROPPED_CONSTRUCTOR,
  RPC_DROP_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';
import { buildTypeLoader, buildConstructorLoader, buildLoadFunc } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';


const loadType = buildTypeLoader(RPC_DROP_ANSWER_TYPE);
const loadConstructor = buildConstructorLoader(RPC_ANSWER_DROPPED_CONSTRUCTOR);
const loadMsgId = loadBigInt;
const loadSeqNo = loadInt;
const loadBytes = loadInt;


/**
 * rpc_answer_dropped#a43ad8b7 msg_id:long seq_no:int bytes:int = RpcDropAnswer;
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset]
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['msgId', loadMsgId],
  ['seqNo', loadSeqNo],
  ['bytes', loadBytes],
]);
