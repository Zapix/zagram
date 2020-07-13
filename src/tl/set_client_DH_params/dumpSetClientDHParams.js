import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { SET_CLIENT_DH_PARAMS } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBytes } from '../bytes';

const dumpMethod = R.pipe(R.always(SET_CLIENT_DH_PARAMS), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpEncryptedData = R.pipe(R.prop('encrypted_data'), dumpBytes);

export default buildDumpFunc([
  dumpMethod,
  dumpNonce,
  dumpServerNonce,
  dumpEncryptedData,
]);
