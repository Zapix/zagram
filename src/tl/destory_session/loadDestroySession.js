import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { DESTROY_SESSION_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(DESTROY_SESSION_TYPE);
const loadSessionId = loadBigInt;

/**
 * destroy_session#e7512126 session_id:long = DestroySessionRes;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['sessionId', loadSessionId],
]);
