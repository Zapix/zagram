// 016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800
// f35c6d01 5e0b86bc00000000 2215bcbd 997275b5
import * as R from 'ramda';
import pako from 'pako';

import { GZIP_PACKED, RPC_RESULT_TYPE, TYPE_KEY } from '../../constants';
import {
  buildTypeLoader,
  buildLoadFunc,
  sliceBuffer,
  uint8ArrayToHex, hexToArrayBuffer,
} from '../../utils';
import { loadBigInt } from '../bigInt';
import { getConstructor } from '../utils';
import { loadBytes } from '../bytes';

const loadType = buildTypeLoader(RPC_RESULT_TYPE);
const loadReqMsgId = loadBigInt;

function unzipMessage(x, withOffset, parseMessage) {
  const { value: zippedValue, offset } = loadBytes(sliceBuffer(x, 4), true);
  const unzippedBuffer = hexToArrayBuffer(uint8ArrayToHex(pako.inflate(zippedValue)));
  const value = parseMessage(unzippedBuffer);
  return withOffset ? ({ value, offset: offset + 4 }) : value;
}

/**
 * Parse rpc result by schema
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {Function} parseMessage
 * @return {{
 *   msgId: BigInt,
 *   message: *
 * }}
 */
function loadRpcResult(buffer, withOffset, parseMessage) {
  const loadMessage = R.unapply(R.pipe(
    R.cond([
      [
        R.pipe(R.nth(0), getConstructor, R.equals(GZIP_PACKED)),
        R.apply(R.partialRight(unzipMessage, [parseMessage])),
      ],
      [R.T, R.apply(parseMessage)],
    ]),
  ));
  return buildLoadFunc([
    [TYPE_KEY, loadType],
    ['reqMsgId', loadReqMsgId],
    ['result', loadMessage],
  ])(buffer, withOffset);
}

export default R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), R.equals(true)), R.nth(-1)]),
  R.apply(loadRpcResult),
));
