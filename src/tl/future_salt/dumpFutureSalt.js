import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { FUTURE_SALT } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(FUTURE_SALT), dumpInt);
const dumpValidSince = R.pipe(R.prop('validSince'), dumpInt);
const dumpValidUntil = R.pipe(R.prop('validUntil'), dumpInt);
const dumpSalt = R.pipe(R.prop('salt'), dumpBigInt);

export default buildDumpFunc([
  dumpType,
  dumpValidSince,
  dumpValidUntil,
  dumpSalt,
]);
