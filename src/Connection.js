import { tag, encode, decode } from './paddedIntermidiate';
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
    this.ws = new WebSocket(this.url, 'binary');
    this.ws.onopen = (e) => {
      const event = new Event('wsOpen');
      event.originEvent = e;
      this.ws.send(this.header);
      this.dispatchEvent(event);
    };
    this.ws.onclose = (e) => {
      const event = new Event('wsClose');
      event.originEvent = e;
      this.dispatchEvent(event);
    };
    this.ws.onerror = (e) => {
      const event = new Event('wsError');
      event.originEvent = e;
      this.dispatchEvent(event);
    };
    this.ws.onmessage = (e) => {
      e.data.arrayBuffer().then((encryptedBuffer) => {
        const paddedBuffer = this.decrypt(encryptedBuffer);
        const buffer = this.decode(paddedBuffer);

        const event = new Event('wsMessage');
        event.originEvent = e;
        event.buffer = buffer;
        this.dispatchEvent(event);
      });
    };
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
