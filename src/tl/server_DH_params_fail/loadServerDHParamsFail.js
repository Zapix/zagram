import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
  SERVER_DH_PARAMS_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';

const loadType = buildTypeLoader(SERVER_DH_PARAMS_TYPE);
const loadConstructor = buildConstructorLoader(SERVER_DH_PARAMS_FAIL_CONSTRUCTOR);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadNewNonceHash = loadBigInt128;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['new_nonce_hash', loadNewNonceHash],
]);
