import * as R from 'ramda';
import {
  shiftRightNBit,
  getNBit,
  maskNumber,
  withConstantOffset,
  getFirstByte,
  arrayBufferToUint8Array, sliceBuffer,
} from '../utils';

const UNIVERSAL = 'UNIVERSAL';
const APPLICATION = 'APPLICATION';
const CONTEXT_SPECIFIC = 'CONTEXT-SPECIFIC';
const PRIVATE = 'PRIVATE';

/**
 * Gets block class
 * @param {ArrayBuffer} buffer - asn1 buffer
 * @returns {str} - block class
 */
export const getBlockClass = R.pipe(
  getFirstByte,
  R.partialRight(shiftRightNBit, [6]),
  R.cond([
    [R.equals(0), R.always(UNIVERSAL)],
    [R.equals(1), R.always(APPLICATION)],
    [R.equals(2), R.always(CONTEXT_SPECIFIC)],
    [R.equals(3), R.always(PRIVATE)],
  ]),
);

/**
 * Gets is asn1 value block multivalue
 * @param {ArrayBuffer} buffer - asn1 buffer
 * @returns {str}
 */
export const isMultiBlock = R.pipe(
  getFirstByte,
  R.partialRight(getNBit, [5]),
  Boolean,
);

/**
 * @param {ArrayBuffer} - asn1 array buffer
 * @returns {Number}
 */
export const getSimpleBlockId = R.pipe(
  getFirstByte,
  R.partial(maskNumber, [0b00011111]),
);

/**
 * Comblex blockId on asn1 encoded as:
 * sequence of bytes. where 8th bit is a flag to get next byte or not.
 * for computing key use other 7 bits
 * @param {ArrayBuffer} buffer
 * @returns {Number}
 */
export function getComplexBlockId(buffer) {
  const uint8Arr = arrayBufferToUint8Array(buffer);
  function readBlockId(value, offset) {
    const byte = uint8Arr[offset];
    const currentValue = value * 127 + maskNumber(byte, 0b01111111);
    if (maskNumber(byte, 0b10000000)) {
      return readBlockId(currentValue, offset + 1);
    }
    return {
      value: currentValue,
      offset: offset + 1,
    };
  }
  return readBlockId(0, 1);
}

/**
 * @param {ArrayBuffer} - asn1 array buffer
 * @returns {Boolean}
 */
export const isComplexBlockId = R.pipe(
  getSimpleBlockId,
  R.equals(31),
);

/**
 * @param {ArrayBuffer} - asn1 array buffer
 * @returns {{ value: Number, offset: Number }}
 */
export const getBlockId = R.cond([
  [
    isComplexBlockId,
    getComplexBlockId,
  ],
  [
    R.T,
    withConstantOffset(getSimpleBlockId, 1),
  ],
]);

export const getBlockIdName = R.cond([
  [R.equals(2), R.always('int')],
  [R.equals(3), R.always('BitString')],
  [R.equals(4), R.always('OctetString')],
  [R.equals(6), R.always('OID')],
  [R.equals(9), R.always('real')],
  [R.equals(16), R.always('sequence')],
  [R.T, R.always('unknown')],
]);

/**
 * @param {ArrayBuffer} buffer
 * @returns {Boolean}
 */
const isSeveralByteLength = R.pipe(
  getFirstByte,
  R.partial(maskNumber, [0b10000000]),
  Boolean,
);

/**
 * @param {ArrayBuffer} buffer
 * @returns {Number}
 */
const getSeveralByteLength = R.pipe(
  R.of,
  R.ap([
    R.identity,
    R.pipe(getFirstByte, R.partial(maskNumber, [0b01111111])),
  ]),
  R.of,
  R.ap([
    R.pipe(
      R.of,
      R.ap([
        R.nth(0),
        R.always(1),
        R.pipe(R.nth(1), R.add(1)),
      ]),
      R.apply(sliceBuffer),
      arrayBufferToUint8Array,
      R.reduce(
        (a, b) => a * 256 + b,
        0,
      ),
    ),
    R.pipe(R.nth(1), R.add(1)),
  ]),
  R.zipObj(['value', 'offset']),
);

/**
 * Get's length from buffer
 * @param {ArrayBuffer} buffer
 * @param {{ value: Number, offset: Number }}
 */
export const getBlockLength = R.cond([
  [
    isSeveralByteLength,
    getSeveralByteLength,
  ],
  [
    R.T,
    withConstantOffset(getFirstByte, 1),
  ],
]);

/**
 * Reads header of asn1 block.
 *
 * @param {ArrayBuffer} buffer
 *
 * @returns {{
 *   value: {
 *     blockClass: str,
 *     blockId: int,
 *     blockIdName,
 *   },
 *   offset: Number
 * }} - values of block header, and offset of header
 *
 */
export function decodeBlockHeader(buffer) {
  const { offset, value: blockId } = getBlockId(buffer);
  return {
    offset,
    value: {
      blockId,
      blockClass: getBlockClass(buffer),
      blockIdName: getBlockIdName(blockId),
      multiValue: isMultiBlock(buffer),
    },
  };
}
