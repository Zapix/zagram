import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import { loadBigInt128 } from '../bigInt128';
import {
  CONSTRUCTOR_KEY,
  REQ_PQ_CONSTRUCTOR,
  RES_PQ_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(RES_PQ_TYPE);
const loadConstructor = buildConstructorLoader(REQ_PQ_CONSTRUCTOR);
const loadNonce = loadBigInt128;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
]);
