import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  SERVER_DH_INNER_DATA_CONSTRUCTOR,
  SERVER_DH_INNER_DATA_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';
import { loadInt } from '../int';
import { loadBytes } from '../bytes';

const loadType = buildTypeLoader(SERVER_DH_INNER_DATA_TYPE);
const loadConstructor = buildConstructorLoader(SERVER_DH_INNER_DATA_CONSTRUCTOR);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadG = loadInt;
const loadDHPrime = loadBytes;
const loadGA = loadBytes;
const loadServerTime = loadInt;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['g', loadG],
  ['dh_prime', loadDHPrime],
  ['g_a', loadGA],
  ['server_time', loadServerTime],
]);
