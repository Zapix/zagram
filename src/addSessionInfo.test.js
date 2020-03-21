import addSessionInfo from './addSessionInfo';
import { copyBytes, uint8ToBigInt } from './utils';

test('addSessionInfo', () => {
  const wrappedMessage = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0, 0, 0, 1, 2, 3, 4];
  const wrappedMessageBuffer = new ArrayBuffer(wrappedMessage.length);
  const wrappedMessageBytes = new Uint8Array(wrappedMessageBuffer);

  copyBytes(wrappedMessage, wrappedMessageBytes);

  const salt = [3, 3, 3, 3, 3, 3, 3, 3];
  const sessionId = [4, 4, 4, 4, 4, 4, 4, 4];
  const messageIdBytes = [2, 2, 2, 2, 2, 2, 2, 2];
  const messageId = uint8ToBigInt(messageIdBytes);
  const seqNoBytes = [5, 0, 0, 0];
  const messageLengthBytes = [wrappedMessage.length, 0, 0, 0];

  const { buffer } = addSessionInfo(salt, sessionId, messageId, 5, wrappedMessageBuffer);

  const expected = [
    ...salt,
    ...sessionId,
    ...messageIdBytes,
    ...seqNoBytes,
    ...messageLengthBytes,
    ...wrappedMessage,
  ];
  const expectedBytes = new Uint8Array(expected.length);
  copyBytes(expected, expectedBytes);

  expect(new Uint8Array(buffer)).toEqual(expectedBytes);
});
