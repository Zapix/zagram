import * as R from 'ramda';
import { isWithOffset, withConstantOffset } from '../../utils';

const toBigInt = (x) => BigInt(x);

const pow = (x, y) => x ** y;

const add = (x, y) => x + y;

const base256 = R.pipe(toBigInt, R.partial(pow, [BigInt(256)]));

const getBase = R.pipe(
  R.of,
  R.ap([
    R.identity,
    R.pipe(R.length, R.times(base256)),
  ]),
  R.apply(R.zip),
);

function loadBytes(buffer) {
  return Array.from(new Uint8Array(buffer, 0, 16));
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {BigInt}
 */
const loadBigInt128 = R.pipe(
  loadBytes,
  R.map(toBigInt),
  getBase,
  R.map(R.apply(R.multiply)),
  R.reduce(add, BigInt(0)),
);

export default R.cond([
  [isWithOffset, withConstantOffset(loadBigInt128, 16)],
  [R.T, loadBigInt128],
]);
