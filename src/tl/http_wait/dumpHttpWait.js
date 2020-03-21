import * as R from 'ramda';
import { dumpInt } from '../int';
import { buildDumpFunc } from '../../utils';
import { HTTP_WAIT } from '../../constants';

// http_wait#9299359f max_delay:int wait_after:int max_wait:int = HttpWait;

const dumpType = R.pipe(R.always(HTTP_WAIT), dumpInt);
const dumpMaxDelay = R.pipe(R.prop('maxDelay'), dumpInt);
const dumpWaitAfter = R.pipe(R.prop('waitAfter'), dumpInt);
const dumpMaxWait = R.pipe(R.prop('maxWait'), dumpInt);

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([
  dumpType,
  dumpMaxDelay,
  dumpWaitAfter,
  dumpMaxWait,
]);
