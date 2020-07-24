import parseExternalHeader from './parseExternalHeader';
import generateKeyIv from './generateKeyIv';
import { decryptIge as decryptAesIge } from './aes';
import parseSessionInfo from './parseSessionInfo';
import { uint8ToArrayBuffer } from './utils';

/**
 * Decrypts servers message
 * @param {Uint8Array} authKey
 * @param {Uint8Array} authKeyId
 * @param {Uint8Array} salt
 * @param {Uint8Array} sessionId
 * @param {ArrayBuffer} serverMessage
 */
export default function decryptMessage(authKey, authKeyId, salt, sessionId, serverMessage) {
  const {
    messageKey: serverMessageKey,
    encryptedMessage,
  } = parseExternalHeader(serverMessage);

  const { key, iv } = generateKeyIv(authKey, serverMessageKey, true);
  const messageWithHeaders = decryptAesIge(
    encryptedMessage,
    uint8ToArrayBuffer(key),
    uint8ToArrayBuffer(iv),
  );
  const {
    seqNo,
    messageId,
    message,
  } = parseSessionInfo(messageWithHeaders);
  return { seqNo, messageId, message };
}
