import { hexToArrayBuffer } from '../../utils';
import loadMsgResendAnsReq from './loadMsgResendAnsReq';
import { MSG_RESEND_ANS_REQ_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgResendReq', () => {
  // constructor: 86 10 ba eb
  const hexStr = 'ebba108615c4b51c02000000000000000a700b5e000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('wihtout offset', () => {
    expect(loadMsgResendAnsReq(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('with offset', () => {
    expect(loadMsgResendAnsReq(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
        msgIds: [
          BigInt('0x5e0b700a00000000'),
          BigInt('0x5e0b800e00000000'),
        ],
      },
      offset: 28,
    });
  });
});
