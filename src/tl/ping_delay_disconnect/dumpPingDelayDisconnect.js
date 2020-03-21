import * as R from 'ramda';

import { PING_DELAY_DISCONNECT } from '../../constants';
import { buildDumpFunc } from '../../utils';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(PING_DELAY_DISCONNECT), dumpInt);
const dumpPingId = R.pipe(R.prop('pingId'), dumpBigInt);
const dumpDisconnectDelay = R.pipe(R.prop('disconnectDelay'), dumpInt);

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpPingId, dumpDisconnectDelay]);
