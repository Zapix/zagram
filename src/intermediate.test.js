import { encode, decode } from './intermediate';
import { arrayBufferToHex, hexToArrayBuffer, sliceBuffer } from './utils';

describe('intermidiate', () => {
  describe('encode', () => {
    test('encode', () => {
      /* eslint-disable */
      const hexStr = '47ac9ff1f17dd4c0cddedf86ad73bc0a40ca51929b881be28248802f006d5de44e3038f6220a366da46f6666f505f80189ee6e36206aa44b398ea1a5cca5cb41ef2519bf7e94941e2e78f0cabe1aa5e1e52b18af7757580c';
      /* eslint-enable */
      const buffer = hexToArrayBuffer(hexStr);

      const encodedBuffer = encode(buffer);

      const tlen = (new Uint32Array(encodedBuffer, 0, 1))[0];
      const paddingSize = tlen % 4;
      const originBuffer = sliceBuffer(encodedBuffer, 4, tlen - paddingSize + 4);
      expect(arrayBufferToHex(originBuffer)).toEqual(hexStr);
    });
  });

  describe('decode', () => {
    test('decode', () => {
      /* eslint-disable */
      const hexEncodedStr = '5a00000047ac9ff1f17dd4c0cddedf86ad73bc0a40ca51929b881be28248802f006d5de44e3038f6220a366da46f6666f505f80189ee6e36206aa44b398ea1a5cca5cb41ef2519bf7e94941e2e78f0cabe1aa5e1e52b18af7757580c2a74';
      const hexStr = '47ac9ff1f17dd4c0cddedf86ad73bc0a40ca51929b881be28248802f006d5de44e3038f6220a366da46f6666f505f80189ee6e36206aa44b398ea1a5cca5cb41ef2519bf7e94941e2e78f0cabe1aa5e1e52b18af7757580c';
      /* eslint-enable */

      const encodedBuffer = hexToArrayBuffer(hexEncodedStr);
      const originBuffer = decode(encodedBuffer);
      const originStr = arrayBufferToHex(originBuffer);
      expect(originStr).toEqual(hexStr);
    });
  });
});
