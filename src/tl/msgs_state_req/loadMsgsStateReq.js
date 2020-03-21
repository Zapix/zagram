import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import { MSGS_STATE_REQ_TYPE, TYPE_KEY } from '../../constants';

/**
 * @param {ArrayBuffer} buffer,
 * @return {*}
 */
export default function loadMsgsStateReq(buffer, withOffset) {
  const { value: msgIds, offset } = loadVector(loadBigInt, buffer.slice(4), true);

  const value = {
    msgIds,
    [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
  };

  return (withOffset) ? { value, offset: offset + 4 } : value;
}
