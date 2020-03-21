import * as R from 'ramda';

import { copyBytes, forgeBufferToArrayBuffer } from './utils';
import { sha256 } from './sha';

const bufferToUint8 = (x) => new Uint8Array(x);

const hashFunc = R.pipe(
  sha256,
  forgeBufferToArrayBuffer,
);

/**
 * @param {Uint8Array} arr
 */
function buildBuffer(arr) {
  const buffer = new ArrayBuffer(arr.length);
  const bufferBytes = new Uint8Array(buffer);
  copyBytes(arr, bufferBytes);
  return buffer;
}

const getSha256 = R.pipe(
  buildBuffer,
  hashFunc,
  bufferToUint8,
);

/**
 * Generating key, iv values for aes encoding
 * For algorithm please check
 * https://core.telegram.org/mtproto/description_v1#defining-aes-key-and-initialization-vector
 * @param {Uint8Array} authKey
 * @param {Uint8Array} msgKey
 * @param {boolean} fromServer
 * @return {{key: Uint8Array, iv: Uint8Array}}
 */
export default function generateKeyIv(authKey, msgKey, fromServer) {
  const x = fromServer ? 8 : 0;

  const sha256a = getSha256(R.flatten([msgKey, R.slice(x, 36 + x, authKey)]));
  const sha256b = getSha256(R.flatten([R.slice(40 + x, 76 + x, authKey), msgKey]));

  return {
    key: R.flatten([
      R.slice(0, 8, sha256a),
      R.slice(8, 24, sha256b),
      R.slice(24, 32, sha256a),
    ]),
    iv: R.flatten([
      R.slice(0, 8, sha256b),
      R.slice(8, 24, sha256a),
      R.slice(24, 32, sha256b),
    ]),
  };
}
