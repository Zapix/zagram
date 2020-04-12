import * as R from 'ramda';
import {
  arrayBufferToHex, arrayBufferToUint8Array,
  getRandomInt,
  mergeAllArrayBuffers,
  sliceBuffer, uint8ToArrayBuffer,
} from './utils';
import { getCipher } from './aes';

const checkFirstByte = R.pipe(
  (buffer) => (new Uint8Array(buffer, 0, 1))[0],
  R.equals(0xef),
  R.not,
);
const checkFirstInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 0, 1))[0],
  R.anyPass([
    R.equals(0x44414548),
    R.equals(0x54534f50),
    R.equals(0x20544547),
    R.equals(0x4954504f),
    R.equals(0xdddddddd),
    R.equals(0xeeeeeeee),
  ]),
  R.not,
);
const checkSecondInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 4, 1))[0],
  R.equals(0x00000000),
  R.not,
);
/**
 * Takes ArrayBuffer init payload and return is it valid or not
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
export const isValidInitPayload = R.allPass([
  checkFirstByte,
  checkFirstInt,
  checkSecondInt,
]);

/**
 * Generates init payload for websocket communication. Please check:
 * https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
 * @param {Number} protocolTag - protocol tag
 * @returns {ArrayBuffer}
 */
export function generateFirstInitPayload(protocolTag) {
  const buffer = new ArrayBuffer(64);
  const prefix = new Uint8Array(buffer, 0, 56);

  const protocolView = new Uint32Array(buffer, 56, 1);
  protocolView[0] = protocolTag;

  const postfix = new Uint8Array(buffer, 60, 4);

  while (!isValidInitPayload(buffer)) {
    for (let i = 0; i < prefix.length; i += 1) {
      prefix[i] = getRandomInt(256);
    }

    for (let i = 0; i < postfix.length; i += 1) {
      postfix[i] += getRandomInt(256);
    }
  }

  return buffer;
}

/**
 * Builds second init payload by reversing first init payload
 * @param {ArrayBuffer} initPayloadBuffer
 * @returns {ArrayBuffer}
 */
export function buildSecondInitPayload(initPayloadBuffer) {
  const buffer = new ArrayBuffer(initPayloadBuffer.byteLength);

  const firstView = new Uint8Array(initPayloadBuffer);
  const secondView = new Uint8Array(buffer);

  for (let i = 0; i < secondView.length; i += 1) {
    secondView[secondView.length - i - 1] = firstView[i];
  }

  return buffer;
}

/**
 * @param {ArrayBuffer} init
 * @param {Function} encrypt
 */
export function buildHeader(init, encrypt) {
  return mergeAllArrayBuffers([
    sliceBuffer(init, 0, 56),
    sliceBuffer(encrypt(init), 56, 64),
  ]);
}

/**
 * Generates obfuscation header and encode/decode function
 * @param {Number} protocolTag - protocol tag
 * @returns {{header: ArrayBuffer, encrypt: Function, decrypt: Function }}
 */
export default function getObfuscation(protocolTag) {
  const initBuffer = generateFirstInitPayload(protocolTag);
  console.log(arrayBufferToHex(initBuffer));
  const reversedInitBuffer = buildSecondInitPayload(initBuffer);

  const encryptKey = sliceBuffer(initBuffer, 8, 40);
  const encryptIv = sliceBuffer(initBuffer, 40, 56);
  const encryptCipher = getCipher(encryptKey, encryptIv);
  const encrypt = R.pipe(
    arrayBufferToUint8Array,
    (x) => encryptCipher.encrypt(x),
    uint8ToArrayBuffer,
  );

  const decryptKey = sliceBuffer(reversedInitBuffer, 8, 40);
  const decryptIv = sliceBuffer(reversedInitBuffer, 40, 56);
  const decryptCipher = getCipher(decryptKey, decryptIv);
  const decrypt = R.pipe(
    arrayBufferToUint8Array,
    (x) => decryptCipher.decrypt(x),
    uint8ToArrayBuffer,
  );

  const header = buildHeader(initBuffer, encrypt);

  return { header, encrypt, decrypt };
}
