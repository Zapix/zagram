import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { dumpInt } from '../int';
import { SERVER_DH_PARAMS_OK } from '../../constants';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBytes } from '../bytes';

const dumpConstructor = R.pipe(R.always(SERVER_DH_PARAMS_OK), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpEncryptedAnswer = R.pipe(R.prop('encrypted_answer'), dumpBytes);

export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
  dumpServerNonce,
  dumpEncryptedAnswer,
]);
