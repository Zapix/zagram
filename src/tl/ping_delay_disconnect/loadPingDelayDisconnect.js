import { buildLoadFunc, buildTypeLoader, buildMethodLoader } from '../../utils';
import {
  METHOD_KEY, PING_DELAY_DISCONNECT_METHOD, PONG_TYPE, TYPE_KEY,
} from '../../constants';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';


const loadType = buildTypeLoader(PONG_TYPE);
const loadMethod = buildMethodLoader(PING_DELAY_DISCONNECT_METHOD);
const loadPingId = loadBigInt;
const loadDisconnectDelay = loadInt;

/**
 * ping_delay_disconnect#f3427b8c ping_id:long disconnect_delay:int = Pong;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['pingId', loadPingId],
  ['disconnectDelay', loadDisconnectDelay],
]);
