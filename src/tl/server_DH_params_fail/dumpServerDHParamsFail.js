import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { SERVER_DH_PARAMS_FAIL } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';

const dumpConstructor = R.pipe(R.always(SERVER_DH_PARAMS_FAIL), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpNewNonceHash = R.pipe(R.prop('new_nonce_hash'), dumpBigInt128);

export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
  dumpServerNonce,
  dumpNewNonceHash,
]);
