/* eslint no-bitwise: 0 */
import aesjs from 'aes-js';

import {
  forgeBufferToArrayBuffer,
  arrayBufferToForgeBuffer,
  copyBytes,
} from './utils';

/**
 * Decryptes data with ige mode. Please check:
 * https://github.com/LonamiWebs/Telethon/blob/6817e199234b68688c5ae1a128353df34f15ba18/telethon/crypto/aes.py#L35
 * @param {forge.util.ByteBuffer} encodedMessage - encodedMessage that should encoded
 * @param {forge.util.ByteBuffer} key - AES-key
 * @param {forge.util.ByteBuffer} iv - AES initialization value
 */
export function decryptIge(encodedMessage, key, iv) {
  const cipherTextBuffer = forgeBufferToArrayBuffer(encodedMessage);


  const keyBuffer = forgeBufferToArrayBuffer(key);
  const keyBlock = new Uint8Array(keyBuffer);

  const ivBuffer = forgeBufferToArrayBuffer(iv);
  const iv1 = new Uint8Array(ivBuffer, 0, ivBuffer.byteLength / 2);
  const iv2 = new Uint8Array(ivBuffer, ivBuffer.byteLength / 2);
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

  return arrayBufferToForgeBuffer(plainTextBuffer);
}

/**
 * Encrypts by AES-IGE algorithm
 * @param {forge.util.ByteBuffer} message
 * @param {forge.util.ByteBuffer} key
 * @param {forge.util.ByteBuffer} iv
 */
export function encryptIge(message, key, iv) {
  const plainTextBuffer = forgeBufferToArrayBuffer(message);

  const keyBuffer = forgeBufferToArrayBuffer(key);
  const keyBlock = new Uint8Array(keyBuffer);

  const ivBuffer = forgeBufferToArrayBuffer(iv);
  const iv1 = new Uint8Array(ivBuffer, 0, ivBuffer.byteLength / 2);
  const iv2 = new Uint8Array(ivBuffer, ivBuffer.byteLength / 2);

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

  return arrayBufferToForgeBuffer(encryptedBuffer);
}
