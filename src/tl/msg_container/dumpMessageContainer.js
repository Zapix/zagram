import * as R from 'ramda';
import { MESSAGE_CONTAINER } from '../../constants';
import { dumpInt } from '../int';
import { buildDumpFunc, mergeAllArrayBuffers } from '../../utils';
import dumpMessage from './dumpMessage';

const dumpType = R.pipe(R.always(MESSAGE_CONTAINER), dumpInt);
const dumpCount = R.pipe(R.path(['messages', 'length']), dumpInt);

/**
 * Dump message container
 * @param {{}} msg
 * @param {Function} dumpFunc
 * @returns {ArrayBuffer}
 */
export default function dumpMessageContainer(msg, dumpFunc) {
  return buildDumpFunc([
    dumpType,
    dumpCount,
    R.pipe(
      R.prop('messages'),
      R.map(R.partialRight(dumpMessage, [dumpFunc])),
      mergeAllArrayBuffers,
    ),
  ])(msg);
}
