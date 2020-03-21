import { MSG_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';

import dumpMsgDetailedInfo from './dumpMsgDetailedInfo';
import { arrayBufferToHex } from '../../utils';

describe('dumpMsgDetailedInfo', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
      msgId: BigInt('0x5e0b700a00000000'),
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 123,
      status: 0,
    };

    const buffer = dumpMsgDetailedInfo(msg);

    const hexStr = 'c63e6d27000000000a700b5e000000000e800b5e7b00000000000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
