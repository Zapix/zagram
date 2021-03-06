import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { MSG_RESEND_REQ } from '../../constants';
import { dumpVector } from '../vector';
import { dumpInt } from '../int';

const dumpFunc = R.pipe(R.always(MSG_RESEND_REQ), dumpInt);
const dumpMsgIds = R.pipe(R.prop('msgIds'), dumpVector);

/**
 * @param {*} msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpFunc, dumpMsgIds]);
