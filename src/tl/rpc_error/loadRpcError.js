import {
  CONSTRUCTOR_KEY,
  RPC_ERROR_CONSTRUCTOR,
  RPC_ERROR_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadInt } from '../int';
import { loadString } from '../string';
import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';

const loadType = buildTypeLoader(RPC_ERROR_TYPE);
const loadConstructor = buildConstructorLoader(RPC_ERROR_CONSTRUCTOR);
const loadErrorCode = loadInt;
const loadErrorMessage = loadString;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['errorCode', loadErrorCode],
  ['errorMessage', loadErrorMessage],
]);
