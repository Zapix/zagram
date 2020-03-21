import { hexToArrayBuffer } from '../../utils';
import loadMsgResendReq from './loadMsgResendReq';
import { MSG_RESEND_REQ_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgResendReq', () => {
  // constructor: 7d861a08
  const hexStr = '081a867d15c4b51c02000000000000000a700b5e000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('wihtout offset', () => {
    expect(loadMsgResendReq(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('with offset', () => {
    expect(loadMsgResendReq(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
        msgIds: [
          BigInt('0x5e0b700a00000000'),
          BigInt('0x5e0b800e00000000'),
        ],
      },
      offset: 28,
    });
  });
});
