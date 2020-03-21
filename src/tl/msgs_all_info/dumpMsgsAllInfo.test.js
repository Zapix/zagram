import { MSGS_ALL_INFO_TYPE, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';

import dumpMsgsAllInfo from './dumpMsgsAllInfo';

describe('dumpMsgsAllInfo', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
      info: [12, 13],
    };
    const buffer = dumpMsgsAllInfo(msg);

    const hexStr = '31d1c08c15c4b51c02000000000000000a700b5e000000000e800b5e020c0d00';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
