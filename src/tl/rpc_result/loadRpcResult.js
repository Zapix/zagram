// 016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800
// f35c6d01 5e0b86bc00000000 2215bcbd 997275b5
import * as R from 'ramda';

import { RPC_RESULT_TYPE, TYPE_KEY } from '../../constants';
import { buildLoadFunc, buildTypeLoader } from '../../utils';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(RPC_RESULT_TYPE);
const loadReqMsgId = loadBigInt;

/**
 * Parse rpc result by schema
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {Function} loadMessage
 * @return {{
 *   msgId: BigInt,
 *   message: *
 * }}
 */
function loadRpcResult(buffer, withOffset, loadMessage) {
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
