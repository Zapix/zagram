import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { CLIENT_DH_INNER_DATA } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt128 } from '../bigInt128';
import { dumpBigInt } from '../bigInt';
import { dumpBytes } from '../bytes';

const dumpConstructor = R.pipe(R.always(CLIENT_DH_INNER_DATA), dumpInt);
const dumpNonce = R.pipe(R.prop('nonce'), dumpBigInt128);
const dumpServerNonce = R.pipe(R.prop('server_nonce'), dumpBigInt128);
const dumpRetryId = R.pipe(R.prop('retry_id'), dumpBigInt);
const dumpGB = R.pipe(R.prop('g_b'), dumpBytes);

export default buildDumpFunc([
  dumpConstructor,
  dumpNonce,
  dumpServerNonce,
  dumpRetryId,
  dumpGB,
]);
