import { buildLoadFunc, buildTypeLoader } from '../../utils';
import { PING_DELAY_DISCONNECT_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';


const loadType = buildTypeLoader(PING_DELAY_DISCONNECT_TYPE);
const loadPingId = loadBigInt;
const loadDisconnectDelay = loadInt;

/**
 * ping_delay_disconnect#f3427b8c ping_id:long disconnect_delay:int = Pong;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['pingId', loadPingId],
  ['disconnectDelay', loadDisconnectDelay],
]);
