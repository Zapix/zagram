import * as R from 'ramda';

import { RPC_ANSWER_DROPPED } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { mergeAllArrayBuffers } from '../../utils';

const dumpType = R.pipe(R.always(RPC_ANSWER_DROPPED), dumpInt);
const dumpMsgId = R.pipe(R.prop('msgId'), dumpBigInt);
const dumpSeqNo = R.pipe(R.prop('seqNo'), dumpInt);
const dumpBytes = R.pipe(R.prop('bytes'), dumpInt);

/**
 * @param {{}} value
 * @returns {ArrayBuffer}
 */
export default R.pipe(
  R.of,
  R.ap([dumpType, dumpMsgId, dumpSeqNo, dumpBytes]),
  mergeAllArrayBuffers,
);
