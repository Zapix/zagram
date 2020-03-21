/**
 * Splits vector to buffer array of each values
 * @param {Function} loadItem - function that allows load item
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset] - return offset value or just vector structure
 * @returns {*[]}
 */
export default function loadVector(loadItem, buffer, withOffset) {
  // TODO: allow to parse vectors with any values
  const count = (new Uint32Array(buffer.slice(4), 0, 1))[0];

  const items = [];
  let offset = 8;

  for (let i = 0; i < count; i += 1) {
    const itemBuffer = buffer.slice(offset);
    const { value: item, offset: itemOffset } = loadItem(itemBuffer, true);
    items.push(item);
    offset += itemOffset;
  }

  return (withOffset) ? { offset, value: items } : items;
}
