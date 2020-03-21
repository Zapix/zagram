import { MSGS_STATE_INFO_TYPE, TYPE_KEY } from '../../constants';
import dumpMsgsStateInfo from './dumpMsgsStateInfo';
import { arrayBufferToHex } from '../../utils';

describe('dumpMsgsStateInfo', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
      reqMsgId: BigInt('0x5e072d4500000000'),
      info: [1, 1, 4, 12],
    };

    const buffer = dumpMsgsStateInfo(msg);
    const hexStr = '7db5de0400000000452d075e040101040c000000';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
