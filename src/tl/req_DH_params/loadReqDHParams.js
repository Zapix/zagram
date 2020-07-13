import { buildLoadFunc, buildTypeLoader, buildMethodLoader } from '../../utils';
import {
  METHOD_KEY,
  SERVER_DH_PARAMS_TYPE,
  REQ_DH_PARAMS_METHOD,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';
import { loadBytes } from '../bytes';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(SERVER_DH_PARAMS_TYPE);
const loadMethod = buildMethodLoader(REQ_DH_PARAMS_METHOD);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadP = loadBytes;
const loadQ = loadBytes;
const loadFingerprint = loadBigInt;
const loadEncryptedData = loadBytes;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['p', loadP],
  ['q', loadQ],
  ['fingerprint', loadFingerprint],
  ['encrypted_data', loadEncryptedData],
]);
