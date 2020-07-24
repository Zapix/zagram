import * as R from 'ramda';
import {
  shiftRightNBit,
  getNBit,
  maskNumber,
  withConstantOffset,
  getFirstByte,
  arrayBufferToUint8Array, sliceBuffer, applyAll, addWithOffsetArg,
} from '../utils';
import { decodeInt, isIntHeader } from './integer';
import { decodeOID, isOIDHeader } from './OID';
import { decodeNull, isNullHeader } from './null';
import { decodeBoolean, isBooleanHeader } from './boolean';
import { decodeBitStringHeader, isBitStringHeader } from './BitString';
import { decodeSequence, isSequenceHeader } from './sequence';

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
  [R.equals(1), R.always('boolean')],
  [R.equals(2), R.always('int')],
  [R.equals(3), R.always('BitString')],
  [R.equals(4), R.always('OctetString')],
  [R.equals(5), R.always('null')],
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
 * @return {{ value: Number, offset: Number }}
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
 * Takes block header info and full asn1 array buffer, returns length
 * @param {{ offset: Number, value: * }} header - asn1 header
 * @param {ArrayBuffer} buffer - asn1 buffer
 */
const getBlockLengthFromBufferWithHeader = R.pipe(
  applyAll([
    R.nth(1),
    R.pipe(R.nth(0), R.prop('offset')),
  ]),
  R.apply(sliceBuffer),
  getBlockLength,
);


/**
 * @param {{ offset: Number, value: * }} head - asn1 header info
 * @param {{ offset: Number, value: Number }} length - asn1 block length info
 * @returns {Number} - offset of header and length block for asn1 buffer
 */
const getHeaderAndLengthBlockOffset = R.unapply(R.pipe(
  applyAll([
    R.pipe(R.nth(0), R.prop('offset')),
    R.pipe(R.nth(1), R.prop('offset')),
  ]),
  R.sum,
));

/**
 * @param {{ offset: Number, value: * }} head - asn1 header info
 * @param {{ offset: Number, value: Number }} length - asn1 block length info
 * @returns {Number} - total length of whole asn1 block
 */
const getTotalBlockLength = R.unapply(R.pipe(
  applyAll([
    R.pipe(R.nth(0), R.prop('offset')),
    R.pipe(R.nth(1), R.prop('offset')),
    R.pipe(R.nth(1), R.prop('value')),
  ]),
  R.sum,
));

/**
 * @param {{ offset: Number, value: * }} head - asn1 header info
 * @param {{ offset: Number, value: Number }} length - asn1 block length info
 * @param {ArrayBuffer} buffer - asn1 buffer
 * @returns {ArrayBuffer} - asn1 encoded value without header and length blocks
 */
const cutValueBuffer = R.unapply(R.pipe(
  applyAll([
    R.nth(2),
    R.apply(getHeaderAndLengthBlockOffset),
    R.apply(getTotalBlockLength),
  ]),
  R.apply(sliceBuffer),
));

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

function notifyThatAsn1BufferCannotBeenDecoded(header, buffer) {
  console.warn('Can`t decode asn1 buffer');
  console.warn('Header value: ', header);
  console.warn('Plain buffer value', buffer);
}

/**
 * Decode asn1 value to js object
 * @param {ArrayBuffer} buffer - asn1 encoded buffer
 * @param {Boolean} withOffset - returns offset of decoded buffer or not
 * @returns {*} - js object that has been encrypted
 */
export function decode(buffer, withOffset) {
  const getValueDecoder = R.cond([
    [isBooleanHeader, R.always(decodeBoolean)],
    [isIntHeader, R.always(decodeInt)],
    [isBitStringHeader, R.always(decodeBitStringHeader)],
    [isNullHeader, R.always(decodeNull)],
    [isOIDHeader, R.always(decodeOID)],
    [isSequenceHeader, R.always(R.partialRight(decodeSequence, [decode]))],
    [R.T, R.curry(notifyThatAsn1BufferCannotBeenDecoded)],
  ]);

  const decodeBuffer = addWithOffsetArg(R.pipe(
    applyAll([
      decodeBlockHeader,
      R.identity,
    ]),
    applyAll([
      R.nth(0),
      getBlockLengthFromBufferWithHeader,
      R.nth(1),
    ]),
    applyAll([ // gets block header, buffer only with current value, and total offset
      R.pipe(
        applyAll([
          R.pipe(R.nth(0), R.prop('value'), getValueDecoder),
          R.apply(cutValueBuffer),
        ]),
        R.apply(R.call),
      ),
      R.apply(getTotalBlockLength),
    ]),
    R.zipObj(['value', 'offset']),
  ));

  return decodeBuffer(buffer, withOffset);
}
