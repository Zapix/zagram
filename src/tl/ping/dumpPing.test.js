import { PING_TYPE, TYPE_KEY } from '../../constants';
import dumpPing from './dumpPing';
import { arrayBufferToHex } from '../../utils';

describe('dumpPing', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: PING_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
    };
    const buffer = dumpPing(msg);

    const hexStr = 'ec77be7a000000000e800b5e';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
