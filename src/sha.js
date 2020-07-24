import * as R from 'ramda';
import sha1_ from '@cryptography/sha1';
import sha256_ from '@cryptography/sha256';

import {
  arrayBufferToUint8Array,
  hexToArrayBuffer,
} from './utils';

const prepareData = R.pipe(
  R.cond([
    [R.is(ArrayBuffer), arrayBufferToUint8Array],
    [R.is(Uint8Array), R.identity],
  ]),
  (x) => Array.from(x),
  R.map((buf) => String.fromCharCode(buf)),
  R.join(''),
);

/**
 * Returns
 * @param {ArrayBuffer|forge.util.ByteBuffer} data
 * @returns {ArrayBuffer}
 */
export const sha1 = R.pipe(
  prepareData,
  R.partialRight(sha1_, ['hex']),
  hexToArrayBuffer,
);

/**
 * Returns
 * @param {ArrayBuffer|forge.util.ByteBuffer} data
 * @returns {ArrayBuffer}
 */
export const sha256 = R.pipe(
  prepareData,
  R.partialRight(sha256_, ['hex']),
  hexToArrayBuffer,
);
