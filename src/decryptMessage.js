import * as R from 'ramda';

import {
  arrayBufferToForgeBuffer,
  forgeBufferToArrayBuffer,
  uint8toForgeBuffer,
} from './utils';
import parseExternalHeader from './parseExternalHeader';
import generateKeyIv from './generateKeyIv';
import { decryptIge as decryptAesIge } from './aes';
import parseSessionInfo from './parseSessionInfo';

const decrypt = R.pipe(
  R.unapply(R.of),
  R.ap([
    R.pipe(R.nth(0), arrayBufferToForgeBuffer),
    R.pipe(R.nth(1), uint8toForgeBuffer),
    R.pipe(R.nth(2), uint8toForgeBuffer),
  ]),
  R.apply(decryptAesIge),
  forgeBufferToArrayBuffer,
);

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
  const messageWithHeaders = decrypt(encryptedMessage, key, iv);
  const {
    seqNo,
    messageId,
    message,
  } = parseSessionInfo(messageWithHeaders);
  return { seqNo, messageId, message };
}
