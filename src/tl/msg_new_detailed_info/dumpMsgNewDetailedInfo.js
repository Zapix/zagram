import * as R from 'ramda';
import { MSG_NEW_DETAILED_INFO } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';

const dumpConstructor = R.pipe(R.always(MSG_NEW_DETAILED_INFO), dumpInt);
const dumpAnswerMsgId = R.pipe(R.prop('answerMsgId'), dumpBigInt);
const dumpBytes = R.pipe(R.prop('bytes'), dumpInt);
const dumpStatus = R.pipe(R.props('state'), dumpInt);

/**
 * @param {*} buffer
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpConstructor, dumpAnswerMsgId, dumpBytes, dumpStatus]);
