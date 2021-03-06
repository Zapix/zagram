import * as R from 'ramda';

import addSessionInfo from './addSessionInfo';
import getMsgKey from './getMsgKey';
import generateKeyIv from './generateKeyIv';
import { encryptIge as encryptAesIge } from './aes';
import padBytes from './padBytes';
import addExternalHeader from './addExternalHeader';
import { uint8ToArrayBuffer } from './utils';

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
  const encryptedBuffer = encryptAesIge(
    uint8ToArrayBuffer(padded),
    uint8ToArrayBuffer(key),
    uint8ToArrayBuffer(iv),
  );

  return addExternalHeader(authKeyId, messageKey, encryptedBuffer);
}
