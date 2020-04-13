/**
 * @param {Connection} ws - ws connection object
 * @param {ArrayBuffer} buffer - array buffer object
 */
export default function sendWsRequest(ws, buffer) {
  return new Promise((resolve, reject) => {
    function handleSuccess(event) {
      ws.removeEventListener('wsMessage', handleSuccess);
      /* eslint-disable */
      ws.removeEventListener('wsError', handleError);
      ws.removeEventListener('wsClose', handleError);
      /* eslint-enable */
      resolve(event.buffer);
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
    ws.send(buffer);
  });
}
