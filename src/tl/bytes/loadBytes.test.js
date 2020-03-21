import { hexToArrayBuffer } from '../../utils';
import { loadBytes } from './index';

describe('loadBytes', () => {
  const hexStr = '040c0a010f000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadBytes(buffer)).toEqual([12, 10, 1, 15]);
  });

  it('with offset', () => {
    expect(loadBytes(buffer, true)).toEqual({
      value: [12, 10, 1, 15],
      offset: 8,
    });
  });
});
