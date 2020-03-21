import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { PONG } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(PONG), dumpInt);
const dumpMsgId = R.pipe(R.prop('msgId'), dumpBigInt);
const dumpPingId = R.pipe(R.prop('pingId'), dumpBigInt);

export default buildDumpFunc([dumpType, dumpMsgId, dumpPingId]);
