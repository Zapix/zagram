import * as R from 'ramda';

import { DESTROY_SESSION_OK } from '../../constants';
import { buildDumpFunc } from '../../utils';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(DESTROY_SESSION_OK), dumpInt);
const dumpSessionId = R.pipe(R.prop('sessionId'), dumpBigInt);

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpSessionId]);
