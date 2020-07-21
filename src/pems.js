import * as R from 'ramda';
import forge from 'node-forge';

import {
  applyAll,
  arrayBufferToUint8Array,
  bigIntToUint8Array,
  toArray, uint8ArrayToHex,
  uint8ToArrayBuffer,
} from './utils';
import { toTlString } from './tl/tlSerialization';
import readPublicKey from './readPublicKey';
import { sha1 } from './sha';

const pems = [`
-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
-----END RSA PUBLIC KEY-----
`, `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruw2yP/BCcsJliRoW5eB
VBVle9dtjJw+OYED160Wybum9SXtBBLXriwt4rROd9csv0t0OHCaTmRqBcQ0J8fx
hN6/cpR1GWgOZRUAiQxoMnlt0R93LCX/j1dnVa/gVbCjdSxpbrfY2g2L4frzjJvd
l84Kd9ORYjDEAyFnEA7dD556OptgLQQ2e2iVNq8NZLYTzLp5YpOdO1doK+ttrltg
gTCy5SrKeLoCPPbOgGsdxJxyz5KKcZnSLj16yE5HvJQn0CNpRdENvRUXe6tBP78O
39oJ8BTHp9oIjd6XWXAsp2CvK45Ol8wFXGF710w9lwCGNbmNxNYhtIkdqfsEcwR5
JwIDAQAB
-----END PUBLIC KEY-----
`, `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvfLHfYH2r9R70w8prHbl
Wt/nDkh+XkgpflqQVcnAfSuTtO05lNPspQmL8Y2XjVT4t8cT6xAkdgfmmvnvRPOO
KPi0OfJXoRVylFzAQG/j83u5K3kRLbae7fLccVhKZhY46lvsueI1hQdLgNV9n1cQ
3TDS2pQOCtovG4eDl9wacrXOJTG2990VjgnIKNA0UMoP+KF03qzryqIt3oTvZq03
DyWdGK+AZjgBLaDKSnC6qD2cFY81UryRWOab8zKkWAnhw2kFpcqhI0jdV5QaSCEx
vnsjVaX0Y1N0870931/5Jb9ICe4nweZ9kSDF/gip3kWLG0o8XQpChDfyvsqB9OLV
/wIDAQAB
-----END PUBLIC KEY-----
`, `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs/ditzm+mPND6xkhzwFI
z6J/968CtkcSE/7Z2qAJiXbmZ3UDJPGrzqTDHkO30R8VeRM/Kz2f4nR05GIFiITl
4bEjvpy7xqRDspJcCFIOcyXm8abVDhF+th6knSU0yLtNKuQVP6voMrnt9MV1X92L
GZQLgdHZbPQz0Z5qIpaKhdyA8DEvWWvSUwwc+yi1/gGaybwlzZwqXYoPOhwMebzK
Uk0xW14htcJrRrq+PXXQbRzTMynseCoPIoke0dtCodbA3qQxQovE16q9zz4Otv2k
4j63cz53J+mhkVWAeWxVGI0lltJmWtEYK6er8VqqWot3nqmWMXogrgRLggv/Nbbo
oQIDAQAB
-----END PUBLIC KEY-----
`, `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvmpxVY7ld/8DAjz6F6q0
5shjg8/4p6047bn6/m8yPy1RBsvIyvuDuGnP/RzPEhzXQ9UJ5Ynmh2XJZgHoE9xb
nfxL5BXHplJhMtADXKM9bWB11PU1Eioc3+AXBB8QiNFBn2XI5UkO5hPhbb9mJpjA
9Uhw8EdfqJP8QetVsI/xrCEbwEXe0xvifRLJbY08/Gp66KpQvy7g8w7VB8wlgePe
xW3pT13Ap6vuC+mQuJPyiHvSxjEKHgqePji9NP3tJUFQjcECqcm0yV7/2d0t/pbC
m+ZH1sadZspQCEPPrtbkQBlvHb4OLiIWPGHKSMeRFvp3IWcmdJqXahxLCUS1Eh6M
AQIDAQAB
-----END PUBLIC KEY-----
`];

const publicKeys = pems.map((x) => forge.pki.publicKeyFromPem(x));
const publicKeysNew = R.map(readPublicKey, pems);

const forgeBigIntegerToBigInt = R.pipe(
  R.toString,
  BigInt,
);

const forgeBigIntegerToUint8Array = R.pipe(
  forgeBigIntegerToBigInt,
  bigIntToUint8Array,
);

const forgeBigIntegerToTlString = R.pipe(
  forgeBigIntegerToUint8Array,
  toTlString,
);

const bigIntToTLString = R.pipe(
  bigIntToUint8Array,
  toTlString,
);

/**
 * Takes publicKey and returns telegram fingerprint for them.
 * @param {publicKeys} publickKey - node-force public-key implementation
 */
function buildFingerPrint(publicKey) {
  const md = forge.md.sha1.create();
  const buffer = forge.util.createBuffer();

  const nArray = forgeBigIntegerToTlString(publicKey.n);
  const eArray = forgeBigIntegerToTlString(publicKey.e);
  const neArray = R.concat(nArray, eArray);
  for (let i = 0; i < neArray.length; i += 1) {
    buffer.putByte(neArray[i]);
  }

  md.update(buffer.data);
  const hex = md.digest().toHex();
  return R.pipe(
    R.splitEvery(2),
    R.reverse(),
    R.take(8),
    R.join(''),
  )(hex);
}

const buildFingerPrintNew = R.pipe(
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
  uint8ArrayToHex,
);

const publicKeyMap = R.pipe(
  R.map(
    R.pipe(
      R.of,
      R.ap([buildFingerPrint, R.identity]),
    ),
  ),
  R.fromPairs,
)(publicKeys);

console.log(publicKeyMap);

const publicKeyMapNew = R.pipe(
  R.map(
    applyAll([
      buildFingerPrintNew,
      R.identity,
    ]),
  ),
  R.fromPairs,
)(publicKeysNew);

console.log(publicKeyMapNew);

/**
 * Gets finger print and return publicKey that should be used;
 * @param {BigInt} fingerprint
 * @returns - publicKey object;
 */
export const getPublicKey = R.pipe(
  (x) => x.toString(16),
  R.prop(R.__, publicKeyMap),
);

export default pems;
