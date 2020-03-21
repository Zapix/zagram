import * as R from 'ramda';

import { forgeBufferToArrayBuffer, uint8toForgeBuffer } from './utils';
import addSessionInfo from './addSessionInfo';
import getMsgKey from './getMsgKey';
import generateKeyIv from './generateKeyIv';
import { encryptIge as encryptAesIge } from './aes';
import padBytes from './padBytes';
import addExternalHeader from './addExternalHeader';

const encrypt = R.pipe(
  R.unapply(R.map(uint8toForgeBuffer)),
  R.apply(encryptAesIge),
  forgeBufferToArrayBuffer,
);

export default function encryptMessage(
  authKey,
  authKeyId,
  salt,
  sessionId,
  seqNo,
  messageId,
  messageBuffer,
) {
  const messageWithHeaders = addSessionInfo(salt, sessionId, messageId, seqNo, messageBuffer);

  const paddedBuffer = padBytes(messageWithHeaders.buffer);
  const padded = new Uint8Array(paddedBuffer);
  const messageKey = getMsgKey(R.slice(88, 88 + 32, authKey), padded);

  const { key, iv } = generateKeyIv(authKey, messageKey);
  const encryptedBuffer = encrypt(padded, key, iv);

  return addExternalHeader(authKeyId, messageKey, encryptedBuffer);
}
