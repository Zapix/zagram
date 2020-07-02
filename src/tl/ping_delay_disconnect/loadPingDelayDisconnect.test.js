import { hexToArrayBuffer } from '../../utils';
import loadPingDelayDisconnect from './loadPingDelayDisconnect';
import {
  METHOD_KEY, PING_DELAY_DISCONNECT_METHOD, PONG_TYPE, TYPE_KEY,
} from '../../constants';

describe('loadPingDelayDisconnect', () => {
  const hexStr = '8c7b42f3000000000e800b5e4b000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadPingDelayDisconnect(buffer)).toEqual({
      [TYPE_KEY]: PONG_TYPE,
      [METHOD_KEY]: PING_DELAY_DISCONNECT_METHOD,
      pingId: BigInt('0x5e0b800e00000000'),
      disconnectDelay: 75,
    });
  });

  it('with offset', () => {
    expect(loadPingDelayDisconnect(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: PONG_TYPE,
        [METHOD_KEY]: PING_DELAY_DISCONNECT_METHOD,
        pingId: BigInt('0x5e0b800e00000000'),
        disconnectDelay: 75,
      },
      offset: 16,
    });
  });
});
