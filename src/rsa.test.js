import encode from './rsa';
import { arrayBufferToHex, hexToArrayBuffer } from './utils';

describe('rsa', () => {
  it('encode', () => {
    const publicKey = {
      n: BigInt('3127'),
      e: BigInt('3'),
    };

    const originBuffer = hexToArrayBuffer('0123');
    const encodedBuffer = encode(originBuffer, publicKey);

    const encodedStr = '0583';
    expect(arrayBufferToHex(encodedBuffer)).toEqual(encodedStr);
  });
});
