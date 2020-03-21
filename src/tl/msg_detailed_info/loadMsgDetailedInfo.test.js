import { hexToArrayBuffer } from '../../utils';
import loadMsgDetailedInfo from './loadMsgDetailedInfo';
import { MSG_DETAILED_INFO_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgDetailedInfo', () => {
  // constructor: 27 6d 3e c6
  // msg_id: 5e0b700a00000000
  // answer_msg_id: 5e0b800e00000000
  // bytes: 123
  // status: 0
  const hexStr = 'c63e6d27000000000a700b5e000000000e800b5e7b00000000000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgDetailedInfo(buffer)).toEqual({
      [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
      msgId: BigInt('0x5e0b700a00000000'),
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 123,
      status: 0,
    });
  });

  it('with offset', () => {
    expect(loadMsgDetailedInfo(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
        msgId: BigInt('0x5e0b700a00000000'),
        answerMsgId: BigInt('0x5e0b800e00000000'),
        bytes: 123,
        status: 0,
      },
      offset: 28,
    });
  });
});
