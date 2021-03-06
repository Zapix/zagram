import { hexToArrayBuffer } from '../../utils';
import loadPing from './loadPing';
import {
  METHOD_KEY, PING_METHOD, PONG_TYPE, TYPE_KEY,
} from '../../constants';

describe('loadPing', () => {
  const hexStr = 'ec77be7a000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadPing(buffer)).toEqual({
      [TYPE_KEY]: PONG_TYPE,
      [METHOD_KEY]: PING_METHOD,
      pingId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('with offset', () => {
    expect(loadPing(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: PONG_TYPE,
        [METHOD_KEY]: PING_METHOD,
        pingId: BigInt('0x5e0b800e00000000'),
      },
      offset: 12,
    });
  });
});
