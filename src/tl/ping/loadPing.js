import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { PING_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(PING_TYPE);
const loadPingId = loadBigInt;

/**
 * ping#7abe77ec ping_id:long
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset]
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['pingId', loadPingId],
]);
