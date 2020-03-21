import * as R from 'ramda';

import parseExternalHeader from './parseExternalHeader';
import { copyBytes } from './utils';

test('parseExternalHeader()', () => {
  const authKeyId = R.times(R.always(1), 8);
  const messageKey = R.times(R.always(2), 16);
  const message = R.times(R.identity, 32);

  const buffer = new ArrayBuffer(authKeyId.length + messageKey.length + message.length);

  const authKeyIdBytes = new Uint8Array(buffer, 0, 8);
  copyBytes(authKeyId, authKeyIdBytes);

  const messageKeyBytes = new Uint8Array(buffer, 8, 16);
  copyBytes(messageKey, messageKeyBytes);

  const encrytptedBytes = new Uint8Array(buffer, 24);
  copyBytes(message, encrytptedBytes);

  const parsedValues = parseExternalHeader(buffer);

  expect(parsedValues.authKeyId).toEqual(authKeyIdBytes);
  expect(parsedValues.messageKey).toEqual(messageKeyBytes);
  expect(parsedValues.encryptedMessage.byteLength).toEqual(message.length);
});
