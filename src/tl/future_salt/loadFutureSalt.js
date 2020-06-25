import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  FUTURE_SALT_CONSTRUCTOR,
  FUTURE_SALTS_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(FUTURE_SALTS_TYPE);
const loadConstructor = buildConstructorLoader(FUTURE_SALT_CONSTRUCTOR);

/**
 * future_salt#0949d9dc valid_since:int valid_until:int salt:long = FutureSalt;
 * @param {ArrayBuffer} buffer
 * @param {boolean} - withOffset
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['validSince', loadInt],
  ['validUntil', loadInt],
  ['salt', loadBigInt],
]);
