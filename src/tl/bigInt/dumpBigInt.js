/**
 * @param {BigInt} value
 * @returns {ArrayBuffer}
 */
export default function dumpBigInt(value) {
  const buffer = new ArrayBuffer(8);
  const view = new BigUint64Array(buffer);
  view[0] = value;
  return buffer;
}
