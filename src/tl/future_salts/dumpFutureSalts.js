import * as R from 'ramda';
import { FUTURE_SALTS } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';
import { dumpVector } from '../vector';


const dumpType = R.pipe(R.always(FUTURE_SALTS), dumpInt);
const dumpReqMsgId = R.pipe(R.prop('reqMsgId'), dumpBigInt);
const dumpNow = R.pipe(R.prop('now'), dumpInt);
const dumpSalts = R.pipe(R.prop('salts'), dumpVector);

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([
  dumpType,
  dumpReqMsgId,
  dumpNow,
  dumpSalts,
]);
