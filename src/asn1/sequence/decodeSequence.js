import * as R from 'ramda';
import { applyAll, sliceBuffer } from '../../utils';

const isEmptyBuffer = R.pipe(
  R.prop('byteLength'),
  R.equals(0),
);

/**
 * @param {ArrayBuffer} buffer - buffer of current sequence
 * @param {Function} decode - common decode function
 * @returns {Array<*>} - list of decoded values
 */
export default function decodeSequence(buffer, decode) {
  function decodeBuffer(result, currentBuffer) {
    return R.cond([
      [isEmptyBuffer, R.always(result)],
      [
        R.T,
        R.pipe(
          applyAll([
            R.partialRight(decode, [true]),
            R.identity,
          ]),
          applyAll([
            R.pipe( // Append decoded value to result array
              R.nth(0),
              R.prop('value'),
              R.append(R.__, result),
            ),
            R.pipe(
              applyAll([ // Slice decoded value
                R.nth(1),
                R.pipe(R.nth(0), R.prop('offset')),
              ]),
              R.apply(sliceBuffer),
            ),
          ]),
          R.apply(decodeBuffer),
        ),
      ],
    ])(currentBuffer);
  }

  return decodeBuffer([], buffer);
}
