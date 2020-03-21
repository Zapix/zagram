/**
 * @param {Number} value
 * @returns {ArrayBuffer}
 */
export default function dumpInt(value) {
  const buffer = new ArrayBuffer(4);
  const view = new Uint32Array(buffer);
  view[0] = value;
  return buffer;
}
