import { hexToArrayBuffer } from '../../utils';
import loadMsgsStateReq from './loadMsgsStateReq';
import { MSGS_STATE_REQ_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgsStateReq', () => {
  // da 69 fb 52
  const hexStr = '52fb69da15c4b51c02000000000000000a700b5e000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgsStateReq(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('with offset', () => {
    expect(loadMsgsStateReq(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
        msgIds: [
          BigInt('0x5e0b700a00000000'),
          BigInt('0x5e0b800e00000000'),
        ],
      },
      offset: 28,
    });
  });
});
