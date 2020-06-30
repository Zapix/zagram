import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import {
  MSGS_STATE_INFO_CONSTRUCTOR,
  MSGS_STATE_INFO_TYPE,
  CONSTRUCTOR_KEY,
  TYPE_KEY,
} from '../../constants';
import { loadBytes } from '../bytes';

/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {*}
 */
const loadType = buildTypeLoader(MSGS_STATE_INFO_TYPE);
const loadConstructor = buildConstructorLoader(MSGS_STATE_INFO_CONSTRUCTOR);
const loadReqMsgId = loadBigInt;
const loadInfo = loadBytes;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['reqMsgId', loadReqMsgId],
  ['info', loadInfo],
]);
