import wrapPlainMessage from './wrapPlainMessage';
import { arrayBufferToHex, hexToArrayBuffer } from './utils';

describe('wrapPlainMessage', () => {
  it('test', () => {
    const messageId = BigInt('0x51e57ac42770964a');
    const payloadHex = '789746603e0549828cca27e966b301a48fece2fc';
    const payloadBuffer = hexToArrayBuffer(payloadHex);

    const wrappedBuffer = wrapPlainMessage(messageId, payloadBuffer);
    expect(arrayBufferToHex(wrappedBuffer))
      .toEqual('00000000000000004a967027c47ae55114000000789746603e0549828cca27e966b301a48fece2fc');
  });
});
