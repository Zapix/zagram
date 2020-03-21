import { hexToArrayBuffer } from '../../utils';
import loadBadServerSalt from './loadBadServerSalt';
import { BAD_SERVER_SALT_TYPE, TYPE_KEY } from '../../constants';

describe('loadBadServerSalt', () => {
  const hexStr = '7b44abed0000000079f60a5e0200000023000000000000000a700b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadBadServerSalt(buffer)).toEqual({
      [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
      newServerSalt: BigInt('0x5e0b700a00000000'),
    });
  });

  it('with offset', () => {
    expect(loadBadServerSalt(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
        badMsgId: BigInt('0x5e0af67900000000'),
        badSeqNo: 2,
        errorCode: 0x23,
        newServerSalt: BigInt('0x5e0b700a00000000'),
      },
      offset: 28,
    });
  });
});
