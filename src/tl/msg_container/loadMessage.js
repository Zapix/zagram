import * as R from 'ramda';

import { buildLoadFunc } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';

const loadMsgId = loadBigInt;
const loadSeqNo = loadInt;
const loadBytes = loadInt;

/**
 * @param {ArrayBuffer} buffer
 * @param {boolean}  [withOffset],
 * @param {Function} load,
 * @returns {{}}
 */
function loadMessage(buffer, withOffset, load) {
  return buildLoadFunc([
    ['msgId', loadMsgId],
    ['seqNo', loadSeqNo],
    ['bytes', loadBytes],
    ['body', load],
  ])(buffer, withOffset);
}

export default R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), R.equals(true)), R.nth(-1)]),
  R.apply(loadMessage),
));
