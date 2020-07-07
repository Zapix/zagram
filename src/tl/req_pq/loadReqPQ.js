import { buildMethodLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import { loadBigInt128 } from '../bigInt128';
import {
  METHOD_KEY,
  REQ_PQ_METHOD,
  RES_PQ_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(RES_PQ_TYPE);
const loadConstructor = buildMethodLoader(REQ_PQ_METHOD);
const loadNonce = loadBigInt128;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadConstructor],
  ['nonce', loadNonce],
]);
