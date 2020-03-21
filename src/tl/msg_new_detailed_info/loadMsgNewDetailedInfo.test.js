import { hexToArrayBuffer } from '../../utils';
import loadMsgNewDetailedInfo from './loadMsgNewDetailedInfo';

import { MSG_NEW_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgNewDetailedInfo', () => {
  // msg_new_detailed_info#809db6df answer_msg_id:long bytes:int status:int
  const hexStr = 'dfb69d80000000000e800b5e0c00000000000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgNewDetailedInfo(buffer)).toEqual({
      [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 12,
      status: 0,
    });
  });

  it('with offset', () => {
    expect(loadMsgNewDetailedInfo(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
        answerMsgId: BigInt('0x5e0b800e00000000'),
        bytes: 12,
        status: 0,
      },
      offset: 20,
    });
  });
});
