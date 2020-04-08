import pako from 'pako';

import { loadBytes } from './bytes';
import { hexToArrayBuffer, sliceBuffer, uint8ArrayToHex } from '../utils';

export default function unzipMessage(x, withOffset, parseMessage) {
  const { value: zippedValue, offset } = loadBytes(sliceBuffer(x, 4), true);
  const unzippedBuffer = hexToArrayBuffer(uint8ArrayToHex(pako.inflate(zippedValue)));
  const value = parseMessage(unzippedBuffer);
  return withOffset ? ({ value, offset: offset + 4 }) : value;
}
