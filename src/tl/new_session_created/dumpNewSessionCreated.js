import * as R from 'ramda';

import { buildDumpFunc } from '../../utils';
import { NEW_SESSION_CREATED } from '../../constants';
import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';

const dumpType = R.pipe(R.always(NEW_SESSION_CREATED), dumpInt);
const dumpFirstMsgId = R.pipe(R.prop('firstMsgId'), dumpBigInt);
const dumpUniqueId = R.pipe(R.prop('uniqueId'), dumpBigInt);
const dumpServerSalt = R.pipe(R.prop('serverSalt'), dumpBigInt);


export default buildDumpFunc([
  dumpType,
  dumpFirstMsgId,
  dumpUniqueId,
  dumpServerSalt,
]);
