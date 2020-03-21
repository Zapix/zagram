import wrapMessage from './wrapMessage';
import { copyBytes, uint8ToBigInt } from './utils';

test('wrapMessage', () => {
  const message = [1, 2, 3, 4];

  const messageBuffer = new ArrayBuffer(message.length);
  const messageBytes = new Uint8Array(messageBuffer);
  copyBytes(message, messageBytes);

  const authKeyId = [1, 1, 1, 1, 1, 1, 1, 1];

  const messageIdBytes = [2, 2, 2, 2, 2, 2, 2, 2];
  const messageId = uint8ToBigInt(messageIdBytes);

  const lengthBytes = [4, 0, 0, 0];

  const { buffer } = wrapMessage(authKeyId, messageId, messageBuffer);

  const expected = [...authKeyId, ...messageIdBytes, ...lengthBytes, ...message];
  const expectedBytes = new Uint8Array(expected.length);
  copyBytes(expected, expectedBytes);

  expect(new Uint8Array(buffer)).toEqual(expectedBytes);
});
