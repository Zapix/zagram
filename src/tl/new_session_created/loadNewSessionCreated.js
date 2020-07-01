import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import {
  CONSTRUCTOR_KEY,
  NEW_SESSION_CREATED_CONSTRUCTOR,
  NEW_SESSION_CREATED_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(NEW_SESSION_CREATED_TYPE);
const loadConstructor = buildConstructorLoader(NEW_SESSION_CREATED_CONSTRUCTOR);
const loadFirstMsgId = loadBigInt;
const loadUniqueId = loadBigInt;
const loadServerSalt = loadBigInt;

/**
 * Parses array buffer with new session created schema
 * @param {ArrayBuffer} buffer
 * @returns {{ firstMsgId: BigInt, uniqueId: BigInt, serverSalt: BigInt }}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['firstMsgId', loadFirstMsgId],
  ['uniqueId', loadUniqueId],
  ['serverSalt', loadServerSalt],
]);
