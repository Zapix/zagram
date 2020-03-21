/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {{}}
 */
import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import { sliceBuffer } from '../../utils';
import { getStringFromArrayBuffer } from '../tlSerialization';
import { MSGS_ALL_INFO_TYPE, TYPE_KEY } from '../../constants';

export default function loadMsgsAllInfo(buffer, withOffset) {
  const { value: msgIds, offset: msgIdOffset } = loadVector(
    loadBigInt,
    sliceBuffer(buffer, 4),
    true,
  );
  const { incomingString: info, offset: infoOffset } = getStringFromArrayBuffer(
    sliceBuffer(buffer, 4 + msgIdOffset),
    0,
  );

  const value = {
    msgIds,
    info: Array.from(info),
    [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
  };
  const offset = 4 + msgIdOffset + infoOffset;

  return (withOffset) ? { value, offset } : value;
}
