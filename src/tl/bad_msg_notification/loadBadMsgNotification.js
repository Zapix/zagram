import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import {
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_MSG_NOTIFICATION_CONSTRUCTOR,
  TYPE_KEY,
  CONSTRUCTOR_KEY,
} from '../../constants';

const loadType = buildTypeLoader(BAD_MSG_NOTIFICATION_TYPE);
const loadConstructor = buildConstructorLoader(BAD_MSG_NOTIFICATION_CONSTRUCTOR);
const loadBadMsgId = loadBigInt;
const loadSeqNo = loadInt;
const loadErrorCode = loadInt;

/**
 * Parse bad msg notification with schema:
 * bad_msg_notification#a7eff811 bad_msg_id:long bad_msg_seqno:int error_code:int
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['badMsgId', loadBadMsgId],
  ['badSeqNo', loadSeqNo],
  ['errorCode', loadErrorCode],
]);
