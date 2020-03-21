import { hexToArrayBuffer } from '../../utils';
import loadPing from './loadPing';
import { PING_TYPE, TYPE_KEY } from '../../constants';

describe('loadPing', () => {
  const hexStr = 'ec77be7a000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadPing(buffer)).toEqual({
      [TYPE_KEY]: PING_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('with offset', () => {
    expect(loadPing(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: PING_TYPE,
        pingId: BigInt('0x5e0b800e00000000'),
      },
      offset: 12,
    });
  });
});
