/**
 * Parses session info from message
 * @param {ArrayBuffer} messageWithSessionInfo
 * @returns {{
 *  salt: Uint8Array,
 *  seqNo: number,
 *  messageId: bigint,
 *  sessionId: Uint8Array,
 *  message: ArrayBuffer
 * }}
 */
export default function parseSessionInfo(messageWithSessionInfo) {
  const salt = new Uint8Array(messageWithSessionInfo, 0, 8);
  const sessionId = new Uint8Array(messageWithSessionInfo, 8, 8);

  const messageIdArr = new BigUint64Array(messageWithSessionInfo, 16, 1);
  const messageId = messageIdArr[0];

  const seqNoArr = new Uint32Array(messageWithSessionInfo, 24, 1);
  const seqNo = seqNoArr[0];

  const messageLengthArr = new Uint32Array(messageWithSessionInfo, 28, 1);
  const messageLength = messageLengthArr[0];

  const message = messageWithSessionInfo.slice(32, 32 + messageLength);

  return {
    salt, sessionId, messageId, seqNo, messageLength, message,
  };
}
