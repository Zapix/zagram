/* eslint no-bitwise: 0 */
import aesjs from 'aes-js';
import * as R from 'ramda';

import {
  arrayBufferToUint8Array,
  copyBytes,
  mergeAllArrayBuffers,
  sliceBuffer,
  uint8ToArrayBuffer,
} from './utils';
import { sha1 } from './sha';

/**
 * Takes uint8 nonce arrays and rturns sha1 of them
 * @param {Uint8Array|Number[]} aNonce
 * @param {Uint8Array|Number[]} bNonce
 * @returns {Uint8Array}
 */
const hashFromNonces = R.unapply(R.pipe(
  R.map(uint8ToArrayBuffer),
  mergeAllArrayBuffers,
  sha1,
  arrayBufferToUint8Array,
));

/**
 * Generates key, iv values for AES encryption
 *
 * answer_with_hash := SHA1(answer) + answer + (0-15 random bytes); such that the length
 * be divisible by 16;
 * tmp_aes_key := SHA1(new_nonce + server_nonce) + substr (SHA1(server_nonce + new_nonce), 0, 12);
 * tmp_aes_iv := substr (SHA1(server_nonce + new_nonce), 12, 8) + SHA1(new_nonce + new_nonce) +
 * substr (new_nonce, 0, 4);
 *
 * @param {Uint8Array|Number[]} serverNonce
 * @param {Uint8Array|Number[]} newNonce
 * @returns {{iv: Uint8Array, key: Uint8Array}} - byte strings of data
 */
export function generateKeyDataFromNonce(serverNonce, newNonce) {
  const newNonceServerNonceHash = uint8ToArrayBuffer(hashFromNonces(newNonce, serverNonce));
  const serverNonceNewNonceHash = uint8ToArrayBuffer(hashFromNonces(serverNonce, newNonce));
  const newNonceNewNonceHash = uint8ToArrayBuffer(hashFromNonces(newNonce, newNonce));

  const key = mergeAllArrayBuffers([
    newNonceServerNonceHash,
    sliceBuffer(serverNonceNewNonceHash, 0, 12),
  ]);

  const iv = mergeAllArrayBuffers([
    sliceBuffer(serverNonceNewNonceHash, 12),
    newNonceNewNonceHash,
    sliceBuffer(uint8ToArrayBuffer(newNonce), 0, 4),
  ]);

  return { key: arrayBufferToUint8Array(key), iv: arrayBufferToUint8Array(iv) };
}


/**
 * Decryptes data with ige mode. Please check:
 * https://github.com/LonamiWebs/Telethon/blob/6817e199234b68688c5ae1a128353df34f15ba18/telethon/crypto/aes.py#L35
 * @param {ArrayBuffer} encodedMessage - encodedMessage that should encoded
 * @param {ArrayBuffer} key - AES-key
 * @param {ArrayBuffer} iv - AES initialization value
 */
export function decryptIge(encodedMessage, key, iv) {
  const cipherTextBuffer = encodedMessage;

  const keyBlock = arrayBufferToUint8Array(key);

  const iv1 = new Uint8Array(iv, 0, iv.byteLength / 2);
  const iv2 = new Uint8Array(iv, iv.byteLength / 2);
  /* eslint-disable-next-line */
  const aesECB = new aesjs.ModeOfOperation.ecb(keyBlock);

  const blocksCount = cipherTextBuffer.byteLength / 16;
  const plainTextBuffer = new ArrayBuffer(cipherTextBuffer.byteLength);

  const cipherTextBlockBuffer = new ArrayBuffer(16);
  const cipherTextBlock = new Uint8Array(cipherTextBlockBuffer);

  for (let blockIdx = 0; blockIdx < blocksCount; blockIdx += 1) {
    const cipherText = new Uint8Array(cipherTextBuffer, blockIdx * 16, 16);
    for (let i = 0; i < 16; i += 1) {
      cipherTextBlock[i] = cipherText[i] ^ iv2[i];
    }

    const plainTextBlockBuffer = new ArrayBuffer(16);
    const bytes = aesECB.decrypt(cipherTextBlock);
    const plainTextBlock = new Uint8Array(plainTextBlockBuffer);
    copyBytes(bytes, plainTextBlock);

    for (let i = 0; i < 16; i += 1) {
      plainTextBlock[i] ^= iv1[i];
    }

    copyBytes(cipherText, iv1);
    copyBytes(plainTextBlock, iv2);

    const plainText = new Uint8Array(plainTextBuffer, blockIdx * 16, 16);
    copyBytes(plainTextBlock, plainText);
  }

  return plainTextBuffer;
}


/**
 * Encrypts by AES-IGE algorithm
 * @param {ArrayBuffer} message
 * @param {ArrayBuffer} key
 * @param {ArrayBuffer} iv
 */
export function encryptIge(message, key, iv) {
  const plainTextBuffer = message;

  const keyBlock = new Uint8Array(key);

  const iv1 = new Uint8Array(iv, 0, iv.byteLength / 2);
  const iv2 = new Uint8Array(iv, iv.byteLength / 2);

  /* eslint-disable-next-line */
  const aesECB = new aesjs.ModeOfOperation.ecb(keyBlock);

  const blocksCount = plainTextBuffer.byteLength / 16;
  const encryptedBuffer = new ArrayBuffer(plainTextBuffer.byteLength);

  const cipherTextBlockBuffer = new ArrayBuffer(16);
  const cipherTextBlock = new Uint8Array(cipherTextBlockBuffer);

  for (let blockIdx = 0; blockIdx < blocksCount; blockIdx += 1) {
    const plainTextBlock = new Uint8Array(plainTextBuffer, blockIdx * 16, 16);
    for (let i = 0; i < 16; i += 1) {
      cipherTextBlock[i] = plainTextBlock[i] ^ iv1[i];
    }

    const aesEncryptedBuffer = new ArrayBuffer(16);
    const bytes = aesECB.encrypt(cipherTextBlock);
    const encryptedTextBlock = new Uint8Array(aesEncryptedBuffer);
    copyBytes(bytes, encryptedTextBlock);

    for (let i = 0; i < 16; i += 1) {
      encryptedTextBlock[i] ^= iv2[i];
    }

    copyBytes(encryptedTextBlock, iv1);
    copyBytes(plainTextBlock, iv2);

    const encryptedText = new Uint8Array(encryptedBuffer, blockIdx * 16, 16);
    copyBytes(encryptedTextBlock, encryptedText);
  }

  return encryptedBuffer;
}


/**
 * Build AES-CTR cipher
 * @param {ArrayBuffer} key
 * @param {ArrayBuffer} iv
 */
export function getCipher(key, iv) {
  const keyView = new Uint8Array(key);
  const ivView = new Uint8Array(iv);

  /* eslint-disable new-cap */
  return new aesjs.ModeOfOperation.ctr(keyView, new aesjs.Counter(ivView));
  /* eslint-enable */
}
