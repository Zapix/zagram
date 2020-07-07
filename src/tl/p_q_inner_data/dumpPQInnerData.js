import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { PQ_INNER_DATA } from '../../constants';
import { dumpInt } from '../int';
import { dumpBytes } from '../bytes';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBigInt256 } from '../bigInt256';


const dumpConstructor = R.pipe(R.always(PQ_INNER_DATA), dumpInt);
const dumpPQ = R.pipe(R.prop('pq'), dumpBytes);
const dumpP = R.pipe(R.prop('p'), dumpBytes);
const dumpQ = R.pipe(R.prop('q'), dumpBytes);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpNewNonce = R.pipe(R.prop('new_nonce'), dumpBigInt256);

export default buildDumpFunc([
  dumpConstructor,
  dumpPQ,
  dumpP,
  dumpQ,
  dumpNonce,
  dumpServerNonce,
  dumpNewNonce,
]);
