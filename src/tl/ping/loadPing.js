import { buildTypeLoader, buildMethodLoader, buildLoadFunc } from '../../utils';
import {
  METHOD_KEY,
  PING_METHOD,
  PONG_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(PONG_TYPE);
const loadMethod = buildMethodLoader(PING_METHOD);
const loadPingId = loadBigInt;

/**
 * ping#7abe77ec ping_id:long
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset]
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['pingId', loadPingId],
]);
