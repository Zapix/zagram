import {
  CONSTRUCTOR_KEY,
  RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
  RPC_DROP_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';
import { buildTypeLoader, buildConstructorLoader, buildLoadFunc } from '../../utils';

const loadType = buildTypeLoader(RPC_DROP_ANSWER_TYPE);
const loadConstructor = buildConstructorLoader(RPC_ANSWER_UNKNOWN_CONSTRUCTOR);

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
]);
