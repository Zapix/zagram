import { getMessageId } from './utils';
import wrapPlainMessage from './wrapPlainMessage';
import unwrapPlainMessage from './unwrapPlainMessage';

/**
 * @param {Connection} ws - ws MTProto connection object
 * @param {Function} loads - loads object by MTProto schema
 * @param {Function} dumps - dumps object by MTProto schema
 * @param {*} payload - payload to send request
 */
export default function sendWsRequest(ws, loads, dumps, payload) {
  return new Promise((resolve, reject) => {
    function handleSuccess(event) {
      ws.removeEventListener('wsMessage', handleSuccess);
      /* eslint-disable */
      ws.removeEventListener('wsError', handleError);
      ws.removeEventListener('wsClose', handleError);
      /* eslint-enable */
      const { buffer: plainMessageBuffer } = unwrapPlainMessage(event.buffer);
      resolve(loads(plainMessageBuffer));
    }

    function handleError(error) {
      console.warn(error);
      ws.removeEventListener('wsMessage', handleSuccess);
      ws.removeEventListener('wsError', handleError);
      ws.removeEventListener('wsClose', handleError);
      reject(error);
    }

    ws.addEventListener('wsMessage', handleSuccess);
    ws.addEventListener('wsError', handleError);
    ws.addEventListener('wsClose', handleError);

    const payloadBuffer = dumps(payload);
    const messageId = getMessageId();
    const messageBuffer = wrapPlainMessage(messageId, payloadBuffer);
    ws.send(messageBuffer);
  });
}
