import unwrapPlainMessage from './unwrapPlainMessage';
import { arrayBufferToHex, hexToArrayBuffer } from './utils';

describe('unwrapPlainMessage', () => {
  it('test', () => {
    /* eslint-disable */
    const wrappedHex = '00000000000000004a967027c47ae55114000000789746603e0549828cca27e966b301a48fece2fc';
    /* eslint-enable */
    const wrappedBuffer = hexToArrayBuffer(wrappedHex);
    const { messageId, buffer } = unwrapPlainMessage(wrappedBuffer);

    expect(messageId).toEqual(BigInt('0x51e57ac42770964a'));

    expect(arrayBufferToHex(buffer))
      .toEqual('789746603e0549828cca27e966b301a48fece2fc');
  });
});
