import * as R from 'ramda';

import padBytes from './padBytes';
import { copyBytes } from './utils';


test('padBytes', () => {
  const message = [1, 2, 3, 4, 5, 6, 7, 8];
  const messageBuffer = new ArrayBuffer(message.length);
  const messageBytes = new Uint8Array(messageBuffer);

  copyBytes(message, messageBytes);
  const paddedBuffer = padBytes(messageBuffer);

  expect(paddedBuffer.byteLength).toEqual(32);
  expect(R.slice(0, 8, new Uint8Array(paddedBuffer))).toEqual(messageBytes);
});
