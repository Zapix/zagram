import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { RES_PQ } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBytes } from '../bytes';
import { dumpBigInt } from '../bigInt';
import { dumpVector } from '../vector';

const dumpConstructor = R.pipe(R.always(RES_PQ), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpPQ = R.pipe(R.prop('pq'), dumpBytes);
const dumpFingerprints = R.pipe(R.prop('fingerprints'), R.partial(dumpVector, [dumpBigInt]));

export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
  dumpServerNonce,
  dumpPQ,
  dumpFingerprints,
]);
