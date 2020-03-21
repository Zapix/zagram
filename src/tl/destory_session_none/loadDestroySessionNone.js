import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { DESTROY_SESSION_NONE_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(DESTROY_SESSION_NONE_TYPE);
const loadSessionId = loadBigInt;

/**
 * destroy_session_ok#62d350c9 session_id:long = DestroySessionRes;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['sessionId', loadSessionId],
]);
