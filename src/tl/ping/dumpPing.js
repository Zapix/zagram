import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { PING } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(PING), dumpInt);
const dumpPingId = R.pipe(R.prop('pingId'), dumpBigInt);

/**
 * @param {{}} obj
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpPingId]);
