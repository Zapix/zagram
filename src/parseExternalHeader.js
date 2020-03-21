/**
 * Parses server response and gets authKeyId, messageKey and encryptedMessage
 * @param {ArrayBuffer} serverResponse
 * @returns {{authKeyId: Uint8Array, messageKey: Uint8Array, encryptedMessage: ArrayBuffer }}
 */
export default function parseExternalHeader(serverResponse) {
  const authKeyId = new Uint8Array(serverResponse, 0, 8);
  const messageKey = new Uint8Array(serverResponse, 8, 16);
  const encryptedMessage = serverResponse.slice(24, serverResponse.byteLength);

  return { authKeyId, messageKey, encryptedMessage };
}
