/**
 * Wraps message with auth_key_id and add info about messageId asn message length
 * @param {Uint8Array} authKeyId - authKeyId received before
 * @param {BigInt} messageId - message id bytes
 * @param {ArrayBuffer} messageBuffer - array buffer of original message
 */
import { copyBuffer, copyBytes } from './utils';

export default function wrapMessage(authKeyId, messageId, messageBuffer) {
  const buffer = new ArrayBuffer(8 + 8 + 4 + messageBuffer.byteLength);
  const authKeyIdBytes = new Uint8Array(buffer, 0, 8);
  copyBytes(authKeyId, authKeyIdBytes);

  const messageIdBytes = new BigUint64Array(buffer, 8, 1);
  messageIdBytes[0] = messageId;

  const messageLength = new Uint32Array(buffer, 16, 1);
  messageLength[0] = messageBuffer.byteLength;

  copyBuffer(messageBuffer, buffer, 20);
  return {
    buffer,
    authKeyId,
    messageIdBytes,
  };
}
