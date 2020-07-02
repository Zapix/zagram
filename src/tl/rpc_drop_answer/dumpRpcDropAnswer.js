import * as R from 'ramda';
import { RPC_DROP_ANSWER } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';

const dumpType = R.pipe(R.always(RPC_DROP_ANSWER), dumpInt);
const dumpReqMsgId = R.pipe(R.prop('reqMsgId'), dumpBigInt);

/**
 * @param {*} value
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpReqMsgId]);
