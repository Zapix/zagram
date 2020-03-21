import { MSGS_STATE_REQ_TYPE, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';

import dumpMsgsStateReq from './dumpMsgsStateReq';

describe('dumpMsgsStateReq', () => {
  it('dump', () => {
    const msg = {
      [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    };

    const hexStr = '52fb69da15c4b51c02000000000000000a700b5e000000000e800b5e';

    const buffer = dumpMsgsStateReq(msg);
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
