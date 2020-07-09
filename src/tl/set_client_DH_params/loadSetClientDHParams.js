import { buildMethodLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  METHOD_KEY,
  SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
  SET_CLIENT_DH_PARAMS_METHOD,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';
import { loadBytes } from '../bytes';

const loadType = buildTypeLoader(SET_CLIENT_DH_PARAMS_ANSWER_TYPE);
const loadMethod = buildMethodLoader(SET_CLIENT_DH_PARAMS_METHOD);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadEncryptedData = loadBytes;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['encrypted_data', loadEncryptedData],
]);
