import { hexToArrayBuffer } from '../../utils';
import loadMsgsStateInfo from './loadMsgsStateInfo';
import { TYPE_KEY, MSGS_STATE_INFO_TYPE } from '../../constants';

describe('loadMsgsStateInfo', () => {
  // constructor:    04deb57d
  // req message id: 5e072d4500000000
  // info [1, 1, 4, 12]
  const hexStr = '7db5de0400000000452d075e040101040c000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgsStateInfo(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
      reqMsgId: BigInt('0x5e072d4500000000'),
      info: [1, 1, 4, 12],
    });
  });

  it('with offset', () => {
    expect(loadMsgsStateInfo(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
        reqMsgId: BigInt('0x5e072d4500000000'),
        info: [1, 1, 4, 12],
      },
      offset: 20,
    });
  });
});
