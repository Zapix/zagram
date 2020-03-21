import { BAD_MSG_NOTIFICATION_TYPE, TYPE_KEY } from '../../constants';
import dumpBadMsgNotification from './dumpBadMsgNotification';
import { arrayBufferToHex } from '../../utils';

describe('dumpBadMsgNotification', () => {
  test('test', () => {
    const msg = {
      [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
    };

    const buffer = dumpBadMsgNotification(msg);

    const hexStr = '11f8efa70000000079f60a5e0200000023000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
