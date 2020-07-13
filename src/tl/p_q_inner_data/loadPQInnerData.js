import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  PQ_INNER_DATA_CONSTRUCTOR,
  PQ_INNER_DATA_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadBytes } from '../bytes';
import { loadBigInt128 } from '../bigInt128';
import { loadBigInt256 } from '../bigInt256';

const loadType = buildTypeLoader(PQ_INNER_DATA_TYPE);
const loadConstructor = buildConstructorLoader(PQ_INNER_DATA_CONSTRUCTOR);
const loadPQ = loadBytes;
const loadP = loadBytes;
const loadQ = loadBytes;
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadNewNonce = loadBigInt256;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['pq', loadPQ],
  ['p', loadP],
  ['q', loadQ],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['new_nonce', loadNewNonce],
]);
