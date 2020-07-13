import * as R from 'ramda';
import { sliceBuffer } from './utils';
import { loadBigInt } from './tl/bigInt';

const getPlainMessageId = R.pipe(
  R.partialRight(sliceBuffer, [8, 16]),
  loadBigInt,
);

/**
 * Takes array buffer with wrapped message and
 * returns message id and buffer contained only message data
 * @param {ArrayBuffer} wrappedMessageBuffer
 * @return {{messageId: bigint, buffer: ArrayBuffer}}
 */
export default function unwrapPlainMessage(wrappedMessageBuffer) {
  return {
    messageId: getPlainMessageId(wrappedMessageBuffer),
    buffer: sliceBuffer(wrappedMessageBuffer, 20),
  };
}
