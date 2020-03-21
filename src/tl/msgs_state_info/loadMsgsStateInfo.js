import { sliceBuffer } from '../../utils';
import { loadBigInt } from '../bigInt';
import { getStringFromArrayBuffer } from '../tlSerialization';
import { MSGS_STATE_INFO_TYPE, TYPE_KEY } from '../../constants';

/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {*}
 */
export default function loadMsgsStateInfo(buffer, withOffset) {
  const reqMsgId = loadBigInt(sliceBuffer(buffer, 4, 12));
  const { incomingString: info, offset } = getStringFromArrayBuffer(buffer, 12);

  const value = {
    reqMsgId,
    info: Array.from(info),
    [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
  };

  return (withOffset) ? { value, offset } : value;
}
