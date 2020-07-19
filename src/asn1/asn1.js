import * as R from 'ramda';
import {
  arrayBufferToUint8Array,
  shiftRightNBit,
  getNBit, maskNumber, withConstantOffset,
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
  arrayBufferToUint8Array,
  R.nth(0),
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
  arrayBufferToUint8Array,
  R.nth(0),
  R.partialRight(getNBit, [5]),
  Boolean,
);

/**
 * @param {ArrayBuffer} - asn1 array buffer
 * @returns {Number}
 */
export const getSimpleBlockId = R.pipe(
  arrayBufferToUint8Array,
  R.nth(0),
  R.partial(maskNumber, [0b00011111]),
);

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
  [R.T, withConstantOffset(getSimpleBlockId, 1)],
]);

export const getBlockIdName = R.cond([
  [R.equals(2), R.always('int')],
  [R.equals(3), R.always('BitString')],
  [R.equals(4), R.always('OctetString')],
  [R.equals(6), R.always('OID')],
  [R.equals(9), R.always('real')],
  [R.equals(16), R.always('sequence')],
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
