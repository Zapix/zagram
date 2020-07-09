import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  DH_GEN_OK_CONSTRUCTOR,
  SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';

const loadType = buildTypeLoader(SET_CLIENT_DH_PARAMS_ANSWER_TYPE);
const loadConstructor = buildConstructorLoader(DH_GEN_OK_CONSTRUCTOR);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadNewNonceHash1 = loadBigInt128;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['new_nonce_hash1', loadNewNonceHash1],
]);
