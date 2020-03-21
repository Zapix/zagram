import { MSG_RESEND_REQ_TYPE, TYPE_KEY } from '../../constants';
import dumpMsgResendReq from './dumpMsgResendReq';
import { arrayBufferToHex } from '../../utils';

describe('dumpMsgResendReq', () => {
  it('dump', () => {
    const msg = {
      [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    };
    const buffer = dumpMsgResendReq(msg);

    const hexStr = '081a867d15c4b51c02000000000000000a700b5e000000000e800b5e';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
