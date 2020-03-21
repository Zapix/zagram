import { PONG_TYPE, TYPE_KEY } from '../../constants';
import dumpPong from './dumpPong';
import { arrayBufferToHex } from '../../utils';

describe('dumpPong', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: PONG_TYPE,
      msgId: BigInt('0x5e072d4500000000'),
      pingId: BigInt('0x56efe14fe8ab347e'),
    };

    const buffer = dumpPong(msg);
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
