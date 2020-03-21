import { PING_DELAY_DISCONNECT_TYPE, TYPE_KEY } from '../../constants';
import dumpPingDelayDisconnect from './dumpPingDelayDisconnect';
import { arrayBufferToHex } from '../../utils';

describe('dumpPingDelayDisconnect', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: PING_DELAY_DISCONNECT_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
      disconnectDelay: 75,
    };

    const buffer = dumpPingDelayDisconnect(msg);

    const hexStr = '8c7b42f3000000000e800b5e4b000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
