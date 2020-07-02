import * as R from 'ramda';
import { FUTURE_SALTS } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { buildDumpFunc } from '../../utils';
import { dumpVector } from '../vector';
import { dumpFutureSalt } from '../future_salt';


const dumpConstructor = R.pipe(R.always(FUTURE_SALTS), dumpInt);
const dumpReqMsgId = R.pipe(R.prop('reqMsgId'), dumpBigInt);
const dumpNow = R.pipe(R.prop('now'), dumpInt);
const dumpSalts = R.pipe(R.prop('salts'), R.partial(dumpVector, [dumpFutureSalt]));

/**
 * @param msg
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([
  dumpConstructor,
  dumpReqMsgId,
  dumpNow,
  dumpSalts,
]);
