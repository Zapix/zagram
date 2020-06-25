import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';
import { BAD_MSG_NOTIFICATION } from '../../constants';


const dumpType = R.always(dumpInt(BAD_MSG_NOTIFICATION));
const dumpMsgId = R.pipe(R.prop('badMsgId'), dumpBigInt);
const dumpSeqNo = R.pipe(R.prop('badSeqNo'), dumpInt);
const dumpErrorCode = R.pipe(R.prop('errorCode'), dumpInt);

/**
 * @param {*} value
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpMsgId, dumpSeqNo, dumpErrorCode]);
