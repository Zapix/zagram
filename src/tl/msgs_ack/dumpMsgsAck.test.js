import { MSGS_ACK_TYPE, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';

import dumpMsgsAck from './dumpMsgsAck';

describe('dumpMsgsAck', () => {
  it('test', () => {
    const msgsAck = {
      [TYPE_KEY]: MSGS_ACK_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    };

    const hexStr = '59b4d66215c4b51c02000000000000000a700b5e000000000e800b5e';
    expect(arrayBufferToHex(dumpMsgsAck(msgsAck))).toEqual(hexStr);
  });
});
