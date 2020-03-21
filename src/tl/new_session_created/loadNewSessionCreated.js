import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { loadBigInt } from '../bigInt';
import { NEW_SESSION_CREATED_TYPE, TYPE_KEY } from '../../constants';

const loadType = buildTypeLoader(NEW_SESSION_CREATED_TYPE);
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
  ['firstMsgId', loadFirstMsgId],
  ['uniqueId', loadUniqueId],
  ['serverSalt', loadServerSalt],
]);
