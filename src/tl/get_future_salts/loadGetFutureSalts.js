import {
  FUTURE_SALTS_TYPE,
  GET_FUTURE_SALTS_METHOD,
  TYPE_KEY,
  METHOD_KEY,
} from '../../constants';
import {
  buildLoadFunc,
  buildTypeLoader,
  buildMethodLoader,
} from '../../utils';
import { loadInt } from '../int';


const loadType = buildTypeLoader(FUTURE_SALTS_TYPE);
const loadMethod = buildMethodLoader(GET_FUTURE_SALTS_METHOD);
const loadNum = loadInt;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['num', loadNum],
]);
