import { tag, encode, decode } from './intermediate';
import getObfuscation from './obfuscation';

/**
 * Base class to work with telegram websocket
 */
export default class Connection extends EventTarget {
  constructor(url) {
    super();
    this.url = url;
    this.tag = tag;
    this.ws = undefined;
    this.encode = encode;
    this.decode = decode;
    const { header, encrypt, decrypt } = getObfuscation(this.tag);
    this.header = header;
    this.encrypt = encrypt;
    this.decrypt = decrypt;
  }

  init() {
    this.ws = new WebSocket(this.url, ['binary']);
    this.ws.binaryType = 'arraybuffer';
    this.ws.addEventListener('open', (e) => {
      const event = new Event('wsOpen');
      event.originEvent = e;
      this.ws.send(this.header);
      this.dispatchEvent(event);
    });

    this.ws.addEventListener('close', (e) => {
      const event = new Event('wsClose');
      event.originEvent = e;
      this.dispatchEvent(event);
    });

    this.ws.addEventListener('error', (e) => {
      const event = new Event('wsError');
      event.originEvent = e;
      this.dispatchEvent(event);
    });

    this.ws.addEventListener('message', (e) => {
      const paddedBuffer = this.decrypt(e.data);
      const buffer = this.decode(paddedBuffer);

      const event = new Event('wsMessage');
      event.originEvent = e;
      event.buffer = buffer;
      this.dispatchEvent(event);
    });
  }

  get readyState() {
    if (!this.ws) {
      return undefined;
    }
    return this.ws.readyState;
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  send(buffer) {
    if (this.readyState !== 1) {
      throw new Error('Can`t send request');
    }
    const paddedBuffer = this.encode(buffer);
    const encryptedBuffer = this.encrypt(paddedBuffer);
    this.ws.send(encryptedBuffer);
  }
}
