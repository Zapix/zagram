import { MSG_RESEND_ANS_REQ_TYPE, TYPE_KEY } from '../../constants';
import dumpMsgResendAnsReq from './dumpMsgResendAnsReq';
import { arrayBufferToHex } from '../../utils';

describe('dumpMsgResendReq', () => {
  it('dump', () => {
    const msg = {
      [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    };
    const buffer = dumpMsgResendAnsReq(msg);

    const hexStr = 'ebba108615c4b51c02000000000000000a700b5e000000000e800b5e';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
