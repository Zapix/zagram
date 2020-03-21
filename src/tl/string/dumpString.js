/**
 * @param {string} value
 * @returns {ArrayBuffer}
 */
import { stringToTlString } from '../tlSerialization';
import { copyBytes } from '../../utils';

export default function dumpString(value) {
  const stringBytes = stringToTlString(value);
  const buffer = new ArrayBuffer(stringBytes.length);
  const view = new Uint8Array(buffer);
  copyBytes(stringBytes, view);

  return buffer;
}
