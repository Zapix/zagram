import { copyBuffer, copyBytes, getNRandomBytes } from './utils';

export default function padBytes(buffer) {
  const minPad = 12;
  const lengthWithMinPad = buffer.byteLength + minPad;
  const roundPad = (16 - (lengthWithMinPad % 16)) % 16;
  const totalPad = minPad + roundPad;
  const length = buffer.byteLength + totalPad;
  const paddedBuffer = new ArrayBuffer(length);
  copyBuffer(buffer, paddedBuffer);

  const randomBytes = getNRandomBytes(totalPad);
  const paddingBytes = new Uint8Array(paddedBuffer, buffer.byteLength);
  copyBytes(randomBytes, paddingBytes);

  return paddedBuffer;
}
