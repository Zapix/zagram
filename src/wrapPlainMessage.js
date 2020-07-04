/**
 * Wraps payload message buffer to plain message
 * @param {ArrayBuffer} payloadBuffer
 */
import { copyBuffer } from './utils';

/**
 * Wraps messageId and message buffer to unencrypt message buffer
 * for more details please check https://core.telegram.org/mtproto/description#unencrypted-message
 * @param {BigInt} messageId
 * @param {ArrayBuffer} payloadBuffer
 * @return {ArrayBuffer}
 */
export default function wrapPlainMessage(messageId, payloadBuffer) {
  const buffer = new ArrayBuffer(8 + 8 + 4 + payloadBuffer.byteLength);

  const authKeyBytes = new BigUint64Array(buffer, 0, 1);
  authKeyBytes[0] = BigInt(0);

  const messageIdBytes = new BigUint64Array(buffer, 8, 1);
  messageIdBytes[0] = messageId;

  const messageLengthBytes = new Uint32Array(buffer, 16, 1);
  messageLengthBytes[0] = payloadBuffer.byteLength;

  copyBuffer(payloadBuffer, buffer, 20);

  return buffer;
}
