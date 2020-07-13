import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CLIENT_DH_INNER_DATA_CONSTRUCTOR,
  CLIENT_DH_INNER_DATA_TYPE, CONSTRUCTOR_KEY, TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';
import { loadBytes } from '../bytes';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(CLIENT_DH_INNER_DATA_TYPE);
const loadConstructor = buildConstructorLoader(CLIENT_DH_INNER_DATA_CONSTRUCTOR);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadRetryId = loadBigInt;
const loadGB = loadBytes;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['retry_id', loadRetryId],
  ['g_b', loadGB],
]);
