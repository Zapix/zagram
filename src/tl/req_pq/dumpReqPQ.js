import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { REQ_PQ } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';

const dumpConstructor = R.pipe(R.always(REQ_PQ), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);

export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
]);
