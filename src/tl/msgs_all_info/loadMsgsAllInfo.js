import * as R from 'ramda';
/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {{}}
 */
import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import { loadBytes } from '../bytes';
import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  MSGS_ALL_INFO_CONSTRUCTOR,
  MSGS_ALL_INFO_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(MSGS_ALL_INFO_TYPE);
const loadConstructor = buildConstructorLoader(MSGS_ALL_INFO_CONSTRUCTOR);
const loadMsgIds = R.partial(loadVector, [loadBigInt]);
const loadInfo = loadBytes;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['msgIds', loadMsgIds],
  ['info', loadInfo],
]);
