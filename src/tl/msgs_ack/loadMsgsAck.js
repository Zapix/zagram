import * as R from 'ramda';
import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import {
  CONSTRUCTOR_KEY, MSGS_ACK_CONSTRUCTOR, MSGS_ACK_TYPE, TYPE_KEY,
} from '../../constants';
import {
  buildLoadFunc,
  buildTypeLoader,
  buildConstructorLoader,
} from '../../utils';

const loadType = buildTypeLoader(MSGS_ACK_TYPE);
const loadConstructor = buildConstructorLoader(MSGS_ACK_CONSTRUCTOR);
const loadMsgIds = R.partial(loadVector, [loadBigInt]);

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['msgIds', loadMsgIds],
]);
