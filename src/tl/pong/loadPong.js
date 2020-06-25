/**
 * Parses array buffer with pong schema
 * @param {ArrayBuffer} buffer
 * @returns {{ msgId: BigInt, pingId: BigInt }}
 */
import { buildLoadFunc, buildConstructorLoader } from '../../utils';
import { PONG_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildConstructorLoader(PONG_TYPE);
const loadMsgId = loadBigInt;
const loadPingId = loadBigInt;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['msgId', loadMsgId],
  ['pingId', loadPingId],
]);
