import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { SERVER_DH_INNER_DATA } from '../../constants';
import { dumpBigInt128 } from '../bigInt128';
import { dumpInt } from '../int';
import { dumpBytes } from '../bytes';

const dumpConstructor = R.pipe(R.always(SERVER_DH_INNER_DATA), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpG = R.pipe(R.prop('g'), dumpInt);
const dumpDHPrime = R.pipe(R.prop('dh_prime'), dumpBytes);
const dumpGA = R.pipe(R.prop('g_a'), dumpBytes);
const dumpServerTime = R.pipe(R.prop('server_time'), dumpInt);


export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
  dumpServerNonce,
  dumpG,
  dumpDHPrime,
  dumpGA,
  dumpServerTime,
]);
