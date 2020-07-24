import * as R from 'ramda';
import {
  applyAll,
  arrayBufferToUint8Array,
  getFirstByte,
  getNBit, maskNumber, sliceBuffer,
  uint8ToBigInt,
} from '../../utils';

const bigIntSubtract = (x, y) => x - y;

const isNegative = R.pipe(
  getFirstByte,
  R.partialRight(getNBit, [7]),
  Boolean,
);

/**
 * Get's x value from array buffer with rules from asn1 standart
 * @param {ArrayBuffer} buffer - encode array buffer
 * @returns {BigInt}
 */
const getXValue = R.pipe(
  applyAll([
    R.pipe(getFirstByte, R.partial(maskNumber, [0b01111111])),
    R.pipe(R.partialRight(sliceBuffer, [1]), arrayBufferToUint8Array),
  ]),
  R.flatten,
  uint8ToBigInt,
);

const getYValue = R.pipe(
  applyAll([
    R.pipe(
      getFirstByte,
      R.partial(maskNumber, [0b10000000]),
    ),
    R.pipe(
      R.prop('byteLength'),
      R.partialRight(R.subtract, [1]),
      R.times(R.always(0)),
    ),
  ]),
  R.flatten,
  uint8ToBigInt,
);

const getPositiveInt = getXValue;
const getNegativeInt = R.pipe(
  applyAll([getXValue, getYValue]),
  R.apply((bigIntSubtract)),
);

export default R.cond([
  [isNegative, getNegativeInt],
  [R.T, getPositiveInt],
]);
