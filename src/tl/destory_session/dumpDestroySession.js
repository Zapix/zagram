import * as R from 'ramda';

import { DESTROY_SESSION } from '../../constants';
import { buildDumpFunc } from '../../utils';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpConstructor = R.pipe(R.always(DESTROY_SESSION), dumpInt);
const dumpSessionId = R.pipe(R.prop('sessionId'), dumpBigInt);

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpConstructor, dumpSessionId]);
