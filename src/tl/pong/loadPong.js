import { buildLoadFunc, buildConstructorLoader, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  PONG_CONSTRUCTOR,
  PONG_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(PONG_TYPE);
const loadConstructor = buildConstructorLoader(PONG_CONSTRUCTOR);
const loadMsgId = loadBigInt;
const loadPingId = loadBigInt;

/**
 * Parses array buffer with pong schema
 * @param {ArrayBuffer} buffer
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['msgId', loadMsgId],
  ['pingId', loadPingId],
]);
