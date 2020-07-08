import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { REQ_DH_PARAMS } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBytes } from '../bytes';
import { dumpBigInt } from '../bigInt';

const dumpMethod = R.pipe(R.always(REQ_DH_PARAMS), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpP = R.pipe(R.prop('p'), dumpBytes);
const dumpQ = R.pipe(R.prop('q'), dumpBytes);
const dumpFingerprint = R.pipe(R.prop('fingerprint'), dumpBigInt);
const dumpEncryptedData = R.pipe(R.prop('encrypted_data'), dumpBytes);

export default buildDumpFunc([
  dumpMethod,
  dumpNonce,
  dumpServerNonce,
  dumpP,
  dumpQ,
  dumpFingerprint,
  dumpEncryptedData,
]);
