import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  DESTROY_SESSION_OK_CONSTRUCTOR,
  DESTROY_SESSION_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(DESTROY_SESSION_TYPE);
const loadConstructor = buildConstructorLoader(DESTROY_SESSION_OK_CONSTRUCTOR);
const loadSessionId = loadBigInt;

/**
 * destroy_session_ok#e22045fc session_id:long = DestroySessionRes;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['sessionId', loadSessionId],
]);
