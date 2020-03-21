import { MSG_NEW_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';
import dumpMsgNewDetailedInfo from './dumpMsgNewDetailedInfo';
import { arrayBufferToHex } from '../../utils';

describe('dumpMsgNewDetailedInfo', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 12,
      status: 0,
    };

    const buffer = dumpMsgNewDetailedInfo(msg);
    const hexStr = 'dfb69d80000000000e800b5e0c00000000000000';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
