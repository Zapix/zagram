import * as R from 'ramda';
import unwrapMessage from './unwrapMessage';
import { copyBytes, uint8ToArrayBuffer, uint8ToBigInt } from './utils';

test('unwrapMessage', () => {
  const authKeyId = R.times(R.always(1), 8);
  const authKeyIdBytes = new Uint8Array(authKeyId.length);
  copyBytes(authKeyId, authKeyIdBytes);

  const messageIdArr = R.times(R.always(2), 8);
  const messageLengthArr = [4, 0, 0, 0];
  const message = [1, 2, 3, 4];

  const wrappedMessage = [
    ...authKeyId,
    ...messageIdArr,
    ...messageLengthArr,
    ...message,
  ];
  const messageBuffer = uint8ToArrayBuffer(wrappedMessage);

  const unwrappedMessage = unwrapMessage(messageBuffer);

  expect(unwrappedMessage.authKeyId).toEqual(authKeyIdBytes);
  expect(unwrappedMessage.messageId).toEqual(uint8ToBigInt(messageIdArr));
  expect(unwrappedMessage.messageLength).toEqual(4);
  expect(unwrappedMessage.message.byteLength).toEqual(4);
});
