import * as R from 'ramda';
import { dumpInt } from '../int';
import { mergeAllArrayBuffers, buildDumpFunc } from '../../utils';
import { dumpBigInt } from '../bigInt';

const dumpMsgId = R.pipe(R.prop('msgId'), dumpBigInt);
const dumpSeqNo = R.pipe(R.prop('seqNo'), dumpInt);


const buildDumpBodyFunc = (dumpFunc) => R.pipe(
  R.prop('body'),
  dumpFunc,
  R.of,
  R.ap([
    R.pipe(R.prop('byteLength'), dumpInt),
    R.identity,
  ]),
  mergeAllArrayBuffers,
);

/**
 * @param msg - message object
 * @returns {ArrayBuffer}
 */
export default function dumpMessage(msg, dumpFunc) {
  return buildDumpFunc([
    dumpMsgId,
    dumpSeqNo,
    buildDumpBodyFunc(dumpFunc),
  ])(msg);
}
