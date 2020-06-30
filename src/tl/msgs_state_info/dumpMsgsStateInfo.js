import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';
import { MSGS_STATE_INFO } from '../../constants';
import { dumpBytes } from '../bytes';

const dumpConstructor = R.pipe(R.always(MSGS_STATE_INFO), dumpInt);
const dumpReqMsgId = R.pipe(R.prop('reqMsgId'), dumpBigInt);
const dumpInfo = R.pipe(R.prop('info'), dumpBytes);

export default buildDumpFunc([dumpConstructor, dumpReqMsgId, dumpInfo]);
