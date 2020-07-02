import {
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_SERVER_SALT_CONSTRUCTOR,
  CONSTRUCTOR_KEY,
  TYPE_KEY,
} from '../../constants';
import { arrayBufferToHex } from '../../utils';
import dumpBadServerSalt from './dumpBadServerSalt';

describe('dump bad server salt', () => {
  it('dump value', () => {
    const badSaltMessage = {
      [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
      [CONSTRUCTOR_KEY]: BAD_SERVER_SALT_CONSTRUCTOR,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
      newServerSalt: BigInt('0x5e0b700a00000000'),
    };

    const hexStr = '7b44abed0000000079f60a5e0200000023000000000000000a700b5e';

    const buffer = dumpBadServerSalt(badSaltMessage);
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
