import * as R from 'ramda';

import { copyBytes } from '../../utils';
import loadString from './loadString';

describe('loadString', () => {
  it('load short string', () => {
    const str = 'My Hello World!';
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const padding = 4 - ((strBytes.length + 1) % 4);

    const buffer = new ArrayBuffer(1 + strBytes.length + padding);
    const lengthView = new Uint8Array(buffer, 0, 1);
    lengthView[0] = strBytes.length;
    const strView = new Uint8Array(buffer, 1, strBytes.length);
    copyBytes(strBytes, strView);

    expect(loadString(buffer)).toEqual(str);
  });

  it('load short string with offset', () => {
    const str = 'Hello World!';
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const padding = 4 - ((strBytes.length + 1) % 4);

    const buffer = new ArrayBuffer(1 + strBytes.length + padding);
    const lengthView = new Uint8Array(buffer, 0, 1);
    lengthView[0] = strBytes.length;
    const strView = new Uint8Array(buffer, 1, strBytes.length);
    copyBytes(strBytes, strView);

    expect(loadString(buffer, true)).toEqual({
      value: str,
      offset: buffer.byteLength,
    });
  });

  it('load long string', () => {
    const str = R.times(R.always('asdfg'), 101).join('');
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const padding = 4 - (strBytes.length % 4);

    const buffer = new ArrayBuffer(4 + strBytes.length + padding);
    const longStrView = new Uint32Array(buffer, 0, 1);
    /* eslint-disable */
    longStrView[0] = (strBytes.length << 8) + 254;
    /* eslint-enable */
    const strView = new Uint8Array(buffer, 4, strBytes.length);
    copyBytes(strBytes, strView);

    expect(loadString(buffer)).toEqual(str);
  });

  it('load long string with offset', () => {
    const str = R.times(R.always('asdfg'), 101).join('');
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const padding = 4 - (strBytes.length % 4);

    const buffer = new ArrayBuffer(4 + strBytes.length + padding);
    const longStrView = new Uint32Array(buffer, 0, 1);
    /* eslint-disable */
    longStrView[0] = (strBytes.length << 8) + 254;
    /* eslint-enable */
    const strView = new Uint8Array(buffer, 4, strBytes.length);
    copyBytes(strBytes, strView);

    expect(loadString(buffer, true)).toEqual({
      value: str,
      offset: buffer.byteLength,
    });
  });
});
