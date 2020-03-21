import { hexToArrayBuffer } from '../../utils';
import loadBadMsgNotification from './loadBadMsgNotification';
import { BAD_MSG_NOTIFICATION_TYPE, TYPE_KEY } from '../../constants';

describe('loadBadMsgNotification', () => {
  const hexStr = '11f8efa70000000079f60a5e0200000023000000';
  const buffer = hexToArrayBuffer(hexStr);

  expect(loadBadMsgNotification(buffer)).toEqual({
    [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
    badMsgId: BigInt('0x5e0af67900000000'),
    badSeqNo: 2,
    errorCode: 0x23,
  });

  it('without offset', () => {
    expect(loadBadMsgNotification(buffer)).toEqual({
      [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
    });
  });

  it('with offset', () => {
    expect(loadBadMsgNotification(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
        badMsgId: BigInt('0x5e0af67900000000'),
        badSeqNo: 2,
        errorCode: 0x23,
      },
      offset: 20,
    });
  });
});
