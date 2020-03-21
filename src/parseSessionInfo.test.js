import * as R from 'ramda';
import parseSessionInfo from './parseSessionInfo';
import { copyBytes, uint8ToArrayBuffer, uint8ToBigInt } from './utils';

test('parseSessionInfo()', () => {
  const salt = R.times(R.always(1), 8);
  const saltBytes = new Uint8Array(salt.length);
  copyBytes(salt, saltBytes);

  const sessionId = R.times(R.always(2), 8);
  const sessionIdBytes = new Uint8Array(sessionId.length);
  copyBytes(sessionId, sessionIdBytes);

  const messageIdArr = R.times(R.always(3), 8);
  const seqNoArr = [2, 0, 0, 0];
  const messageLengthArr = [4, 0, 0, 0];

  const message = [1, 2, 3, 4];
  const messageBytes = new Uint8Array(message.length);
  copyBytes(message, messageBytes);

  const padding = R.times(R.always(0), 12);

  const messageWithHeaderBytes = [
    ...salt,
    ...sessionId,
    ...messageIdArr,
    ...seqNoArr,
    ...messageLengthArr,
    ...message,
    ...padding,
  ];
  expect(messageWithHeaderBytes).toHaveLength(48);

  const messageWithHeader = uint8ToArrayBuffer(messageWithHeaderBytes);

  const parsedSession = parseSessionInfo(messageWithHeader);

  expect(parsedSession.salt).toEqual(saltBytes);
  expect(parsedSession.sessionId).toEqual(sessionIdBytes);
  expect(parsedSession.messageId).toEqual(uint8ToBigInt(messageIdArr));
  expect(parsedSession.seqNo).toEqual(2);
  expect(new Uint8Array(parsedSession.message)).toEqual(messageBytes);
});
