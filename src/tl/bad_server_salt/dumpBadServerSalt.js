import * as R from 'ramda';
import { buildDumpFunc } from '../../utils';
import { dumpInt } from '../int';
import { BAD_SERVER_SALT } from '../../constants';
import { dumpBigInt } from '../bigInt';

const dumpConstructor = R.always(dumpInt(BAD_SERVER_SALT));
const dumpBadMsgId = R.pipe(R.prop('badMsgId'), dumpBigInt);
const dumpBadSeqNo = R.pipe(R.prop('badSeqNo'), dumpInt);
const dumpErrorCode = R.pipe(R.prop('errorCode'), dumpInt);
const dumpNewServerSalt = R.pipe(R.prop('newServerSalt'), dumpBigInt);

/**
 * @param {{*}} value
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([
  dumpConstructor,
  dumpBadMsgId,
  dumpBadSeqNo,
  dumpErrorCode,
  dumpNewServerSalt,
]);
