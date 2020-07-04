/**
 * @param {BigInt} value
 * @returns {ArrayBuffer}
 */
export default function dumpBigInt128(value) {
  const buffer = new ArrayBuffer(16);
  const view = new BigUint64Array(buffer);
  view[0] = value;
  view[1] = value / (BigInt(256) ** BigInt(8));
  return buffer;
}
