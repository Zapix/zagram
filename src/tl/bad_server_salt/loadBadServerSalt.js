import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import {
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_SERVER_SALT_CONSTRUCTOR,
  CONSTRUCTOR_KEY,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(BAD_MSG_NOTIFICATION_TYPE);
const loadConstructor = buildConstructorLoader(BAD_SERVER_SALT_CONSTRUCTOR);
const loadBadMsgId = loadBigInt;
const loadBadSeqNo = loadInt;
const loadErrorCode = loadInt;
const loadNewServerSalt = loadBigInt;

/**
 * @param {ArrayBuffer} buffer
 * @returns {*} - loaded message
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['badMsgId', loadBadMsgId],
  ['badSeqNo', loadBadSeqNo],
  ['errorCode', loadErrorCode],
  ['newServerSalt', loadNewServerSalt],
]);
