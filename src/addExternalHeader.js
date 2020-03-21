import { copyBuffer, copyBytes } from './utils';

/**
 * Adds external header
 * @param {Uint8Array|Number[]} authKeyId - 8 bytes of auth id
 * @param {Uint8Array|Number[]} messageKey - 16 bytes of message id
 * @param {ArrayBuffer} encryptedMessage - buffer array of encrypted message
 * @returns {ArrayBuffer} - buffer with external header
 */
export default function addExternalHeader(authKeyId, messageKey, encryptedMessage) {
  const buffer = new ArrayBuffer(8 + 16 + encryptedMessage.byteLength);

  const authKeyIdBytes = new Uint8Array(buffer, 0, 8);
  copyBytes(authKeyId, authKeyIdBytes);

  const messageKeyIdBytes = new Uint8Array(buffer, 8, 16);
  copyBytes(messageKey, messageKeyIdBytes);

  copyBuffer(encryptedMessage, buffer, 24);

  return buffer;
}
