import {
  getNRandomBytes,
  getRandomInt,
  mergeAllArrayBuffers,
  sliceBuffer,
  uint8ToArrayBuffer,
} from './utils';

export const tag = 0xdddddddd;

/**
 * Encode message for wrapper
 * @param {ArrayBuffer} buffer
 * @returns {ArrayBuffer} padded value
 */
export function encode(buffer) {
  const padSize = getRandomInt(3);
  console.log('Pad size:', padSize);
  const randomBytes = getNRandomBytes(padSize);
  const randomBuffer = uint8ToArrayBuffer(randomBytes);
  const tlen = padSize + buffer.byteLength;

  const tlenBuffer = new ArrayBuffer(4);
  const tlenView = new Uint32Array(tlenBuffer);
  tlenView[0] = tlen;

  return mergeAllArrayBuffers([tlenBuffer, buffer, randomBuffer]);
}

/**
 * Cut padded intermidiate
 * @param {ArrayBuffer} encodedBuffer
 */
export function decode(encodedBuffer) {
  const tlen = (new Uint32Array(encodedBuffer, 0, 1))[0];
  const paddingSize = tlen % 4;
  return sliceBuffer(encodedBuffer, 4, tlen - paddingSize + 4);
}
