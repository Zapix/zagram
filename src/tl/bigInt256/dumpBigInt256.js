/**
 * @param {BigInt} value
 * @returns {ArrayBuffer}
 */
export default function dumpBigInt256(value) {
  const buffer = new ArrayBuffer(32);
  const view = new BigUint64Array(buffer);
  view[0] = value;
  view[1] = value / (BigInt(256) ** BigInt(8));
  view[2] = value / (BigInt(256) ** BigInt(16));
  view[3] = value / (BigInt(256) ** BigInt(24));
  return buffer;
}
