import * as R from 'ramda';
import {
  applyAll,
  arrayBufferToUint8Array,
  getNBit,
  maskNumber,
  sliceBuffer,
} from '../../utils';

/**
 * Split array buffer by number. end value byte is a byte where 7th bit equals to 0
 * @param {ArrayBuffer} buffer - encoded asn1 value
 * @returns {Array<Number>} - list of ids of integer value
 */
const getSplitIdx = R.pipe(
  arrayBufferToUint8Array,
  (x) => Array.from(x),
  R.map(R.partialRight(getNBit, [7])),
  R.addIndex(R.map)((x, y) => [x, y]),
  R.filter(R.pipe(R.nth(0), R.equals(0))),
  R.map(R.nth(1)),
);

/**
 * Gets range of every number in array buffer
 * @param {ArrayBuffer} buffer - encoded asn1 value
 * @returns {Array<[Number, Number]>}
 */
const getIntRange = R.pipe(
  getSplitIdx,
  applyAll([
    R.pipe(R.map(R.inc), R.prepend(0), R.dropLast(1)),
    R.pipe(R.map(R.inc)),
  ]),
  R.apply(R.zip),
);

/**
 * Build slice function to split array to encoded numbers
 * @param {ArrayBuffer} buffer - encoded asn1 value
 * @returns {Array<Function>} - list of functions that could split array
 */
const buildSliceFuncList = R.pipe(
  getIntRange,
  R.map((range) => R.partialRight(sliceBuffer, range)),
);

/**
 * Read SID number from array buffer.
 * Compute SID number as int with base 127
 * @param {ArrayBuffer}
 * @returns {BigInt}
 */
const readSIDNumber = R.pipe(
  arrayBufferToUint8Array,
  (x) => Array.from(x),
  R.map(R.partial(maskNumber, [0b01111111])),
  R.map(BigInt),
  R.reduce(
    (a, b) => a * BigInt(128) + b,
    BigInt(0),
  ),
);

const subtractBigInt = (x, y) => x - y;

/**
 * Read SID 1 and 2 numbers from array buffer by rules for asn1
 * @param {ArrayBuffer}
 * @returns {[BigInt, BigInt]}
 */
const readSID1and2Numbers = R.pipe(
  readSIDNumber,
  R.cond([
    [
      R.gte(39),
      applyAll([
        R.always(BigInt('0')),
        R.identity,
      ]),
    ],
    [
      R.gte(79),
      applyAll([
        R.always(BigInt('1')),
        R.partialRight(R.subtract, [BigInt(40)]),
      ]),
    ],
    [
      R.T,
      applyAll([
        R.always(BigInt('2')),
        R.partialRight(subtractBigInt, [BigInt(80)]),
      ]),
    ],
  ]),
);

/**
 * Reads SID numbers as big int from asn1 buffer1
 * @param {ArrayBuffer}
 * @returns {Array<BigInt>}
 */
const readSIDNumbers = R.pipe(
  applyAll([
    R.pipe(R.nth(0), readSID1and2Numbers),
    R.pipe(
      R.drop(1),
      R.map(readSIDNumber),
    ),
  ]),
  R.flatten,
);

const splitToOIDBuffers = R.pipe(
  applyAll([
    buildSliceFuncList,
    R.of,
  ]),
  R.apply(R.ap),
);

export default R.pipe(
  splitToOIDBuffers,
  readSIDNumbers,
  R.map(R.toString),
  R.join('.'),
);
