import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import { MSGS_ACK_TYPE, TYPE_KEY } from '../../constants';

/**
 * Parse messages acknowledgment by schema
 * msgs_ack#62d6b459 msg_ids:Vector long = MsgsAck;
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {{ type: number, msgIds: Array<Number> }}
 */
export default function loadMsgsAck(buffer, withOffset) {
  const { value: msgIds, offset } = loadVector(loadBigInt, buffer.slice(4), true);

  const value = {
    [TYPE_KEY]: MSGS_ACK_TYPE,
    msgIds,
  };

  return (withOffset) ? { value, offset: (offset + 4) } : value;
}
