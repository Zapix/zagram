import * as R from 'ramda';

import {
  applyAll,
  arrayBufferToUint8Array,
  bigIntToUint8Array,
  toArray,
  uint8ToArrayBuffer, uint8ToBigInt,
} from './utils';
import { toTlString } from './tl/tlSerialization';
import readPublicKey from './readPublicKey';
import { sha1 } from './sha';

const bigIntToTLString = R.pipe(
  bigIntToUint8Array,
  toTlString,
);

/**
 * @param {{n: BigInt, e: BigInt}} - rsa public key,
 * @returns {string} - hex representation of fingerprint
 */
const buildFingerPrint = R.pipe(
  applyAll([
    R.pipe(R.prop('n'), bigIntToTLString),
    R.pipe(R.prop('e'), bigIntToTLString),
  ]),
  R.flatten,
  uint8ToArrayBuffer,
  sha1,
  arrayBufferToUint8Array,
  toArray,
  R.reverse,
  R.take(8),
  uint8ToBigInt,
);

const buildPublicKeyMap = R.pipe(
  R.map(
    R.pipe(
      readPublicKey,
      applyAll([
        buildFingerPrint,
        R.identity,
      ]),
    ),
  ),
  R.fromPairs,
);

/**
 * Taeks list of pems and returns function that takes fingerpint as BigInt and returns public key
 * with n and e values
 */
const getPublicKeyFactory = R.pipe(
  buildPublicKeyMap,
  R.of,
  R.partialRight(R.prop),
);

export default getPublicKeyFactory;
