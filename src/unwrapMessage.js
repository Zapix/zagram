/**
 *
 * @param {ArrayBuffer} wrappedMessage
 * @returns {{}}
 */
import { uint8ArrayToHex } from './utils';

export default function unwrapMessage(wrappedMessage) {
  console.log(uint8ArrayToHex(new Uint8Array(wrappedMessage)));
  const authKeyId = new Uint8Array(wrappedMessage, 0, 8);
  const messageIdArr = new BigUint64Array(wrappedMessage, 8, 1);
  const messageId = messageIdArr[0];
  const messageLengthArr = new Uint32Array(wrappedMessage, 16, 1);
  const messageLength = messageLengthArr[0];
  const message = wrappedMessage.slice(20, 20 + messageLength);
  return {
    authKeyId,
    messageId,
    messageLength,
    message,
  };
}
