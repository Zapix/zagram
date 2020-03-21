import { BOOL_FALSE, BOOL_TRUE } from '../../constants';

export default function dumpBool(value) {
  const buffer = new ArrayBuffer(4);
  const view = new Uint32Array(buffer, 0, 1);
  view[0] = (value) ? BOOL_TRUE : BOOL_FALSE;
  return buffer;
}
