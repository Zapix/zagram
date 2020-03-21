import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { FUTURE_SALT_TYPE, TYPE_KEY } from '../../constants';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(FUTURE_SALT_TYPE);

/**
 * future_salt#0949d9dc valid_since:int valid_until:int salt:long = FutureSalt;
 * @param {ArrayBuffer} buffer
 * @param {boolean} - withOffset
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['validSince', loadInt],
  ['validUntil', loadInt],
  ['salt', loadBigInt],
]);
