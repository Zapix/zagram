import * as R from 'ramda';
import { sha256 } from './sha';
import { forgeBufferToArrayBuffer, uint8ToArrayBuffer } from './utils';


/**
 * Generates message key from u
 *
 * @param {Uint8Array} authKey from 88 to 88 + 32
 * @param {Uint8Array} - payload with padding
 * @returns {Uint8Array} - sha1 of messageBuffer
 */
const getMsgKey = R.pipe(
  R.unapply(R.flatten),
  uint8ToArrayBuffer,
  sha256,
  forgeBufferToArrayBuffer,
  (x) => new Uint8Array(x),
  R.slice(8, 24),
);

export default getMsgKey;
