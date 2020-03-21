import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { dumpBool } from '../bool';
import { dumpString } from '../string';
import { dumpFutureSalt } from '../future_salt';
import { FUTURE_SALT_TYPE, TYPE_KEY, VECTOR } from '../../constants';
import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';

/**
 * @param {Array<*>} value
 * @returns {ArrayBuffer}
 */
const buildVectorPrefixBuffer = R.pipe(
  R.of,
  R.ap([R.always(dumpInt(VECTOR)), R.pipe(R.prop('length'), dumpInt)]),
  R.apply(mergeArrayBuffer),
);

/**
 *
 * @param {[Function]} dumpFunc  - function to dump vector
 * @param {Array<*>} value - Array to dump
 * @returns {ArrayBuffer}
 */
export default function dumpVector(dumpFunc, value) {
  let getDumpFunc;
  if (!value) {
    getDumpFunc = R.cond([
      [R.is(Boolean), R.always(dumpBool)],
      [R.is(Number), R.always(dumpInt)],
      [R.is(BigInt), R.always(dumpBigInt)],
      [R.is(String), R.always(dumpString)],
      [R.is(Array), R.always(dumpVector)],
      [R.pipe(R.prop(TYPE_KEY), R.equals(FUTURE_SALT_TYPE)), R.always(dumpFutureSalt)],
      [R.T, R.always(getEmptyArrayBuffer)],
    ]);
    value = dumpFunc;
  } else {
    getDumpFunc = R.always(dumpFunc);
  }

  const dumpNotEmptyArray = R.pipe(
    R.of,
    R.ap([R.pipe(R.nth(0), getDumpFunc), R.identity]),
    R.apply(R.map),
  );

  const dumpArray = R.cond([
    [R.isEmpty, getEmptyArrayBuffer],
    [R.T, dumpNotEmptyArray],
  ]);

  return R.pipe(
    R.of,
    R.ap([buildVectorPrefixBuffer, dumpArray]),
    R.flatten,
    R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
  )(value);
}
