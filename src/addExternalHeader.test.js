import * as R from 'ramda';

import addExternalHeader from './addExternalHeader';
import { copyBytes } from './utils';

test('addExternalHeader', () => {
  const encryptedMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const encryptedMessageBuffer = new ArrayBuffer(encryptedMessage.length);
  const encryptedMessageBytes = new Uint8Array(encryptedMessageBuffer);
  copyBytes(encryptedMessage, encryptedMessageBytes);

  const authKeyId = R.times(R.always(1), 8);
  const messageKey = R.times(R.always(2), 16);

  const messageWithHeader = addExternalHeader(authKeyId, messageKey, encryptedMessageBuffer);

  const expected = R.flatten([authKeyId, messageKey, encryptedMessage]);
  const expectedBytes = new Uint8Array(expected.length);
  copyBytes(expected, expectedBytes);

  expect(new Uint8Array(messageWithHeader)).toEqual(expectedBytes);
});
