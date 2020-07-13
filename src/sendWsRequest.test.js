import * as R from 'ramda';
import WS from 'jest-websocket-mock';

import sendWsRequest from './sendWsRequest';
import { loads, dumps } from './tl';
import schema from './tl/schema/layer108.json';
import {
  CONSTRUCTOR_KEY, METHOD_KEY,
  REQ_PQ_METHOD,
  RES_PQ_CONSTRUCTOR,
  RES_PQ_TYPE,
  TYPE_KEY,
} from './constants';
import wrapPlainMessage from './wrapPlainMessage';
import { isMessageOf } from './tl/utils';

class Connection extends EventTarget {
  constructor(url) {
    super();
    this.url = url;
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
      const buffer = e.data;

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
    this.ws.send(buffer);
  }
}


describe('sendWsRequest', () => {
  afterEach(() => {
    WS.clean();
  });

  it('send with success response', () => {
    const server = new WS('ws://localhost:1234');
    const ws = new Connection('ws://localhost:1234');

    ws.init();

    server.nextMessage.then(() => {
      const obj = {
        [TYPE_KEY]: RES_PQ_TYPE,
        [CONSTRUCTOR_KEY]: RES_PQ_CONSTRUCTOR,
        nonce: BigInt('0xe77b80516c65fb87c206be9614b20196'),
        server_nonce: BigInt('0x2729111eee6e0d2f324df77ee7234c71'),
        pq: [0x1f, 0xab, 0x62, 0x7f, 0xc4, 0x07, 0xef, 0x5d],
        fingerprints: [BigInt('0xc3b42b026ce86b21')],
      };
      const buffer = dumps(schema, obj);
      const messageBuffer = wrapPlainMessage(BigInt(32), buffer);
      server.send(messageBuffer);
    });

    return server.connected.then(
      () => sendWsRequest(
        ws,
        R.partial(loads, [schema]),
        R.partial(dumps, [schema]),
        {
          [TYPE_KEY]: RES_PQ_TYPE,
          [METHOD_KEY]: REQ_PQ_METHOD,
          nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
        },
      ),
    ).then(
      (value) => expect(isMessageOf(RES_PQ_CONSTRUCTOR, value)).toEqual(true),
    );
  });

  it('send with error', () => {
    const server = new WS('ws://localhost:1234');
    const ws = new Connection('ws://localhost:1234');
    ws.init();

    server.nextMessage.then(() => {
      console.log('Handle message as error');
      server.error('error');
    });

    return server.connected.then(
      () => sendWsRequest(
        ws,
        R.partial(loads, [schema]),
        R.partial(dumps, [schema]),
        {
          [TYPE_KEY]: RES_PQ_TYPE,
          [METHOD_KEY]: REQ_PQ_METHOD,
          nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
        },
      ),
    )
      .then(() => expect(false).toEqual(true))
      .catch(() => expect(true).toEqual(true));
  });

  it('send with close', () => {
    const server = new WS('ws://localhost:1234');
    const ws = new Connection('ws://localhost:1234');
    ws.init();

    server.nextMessage.then(() => {
      server.close();
    });

    return server.connected.then(
      () => sendWsRequest(
        ws,
        R.partial(loads, [schema]),
        R.partial(dumps, [schema]),
        {
          [TYPE_KEY]: RES_PQ_TYPE,
          [METHOD_KEY]: REQ_PQ_METHOD,
          nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
        },
      ),
    )
      .then(() => expect(false).toEqual(true))
      .catch(() => expect(true).toEqual(true));
  });
});
