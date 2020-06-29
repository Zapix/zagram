import { hexToArrayBuffer } from '../../utils';
import loadMsgsAck from './loadMsgsAck';
import {
  TYPE_KEY, CONSTRUCTOR_KEY, MSGS_ACK_TYPE, MSGS_ACK_CONSTRUCTOR,
} from '../../constants';

describe('messages acknowledgment', () => {
  const hexStr = '59b4d66215c4b51c02000000000000000a700b5e000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgsAck(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ACK_TYPE,
      [CONSTRUCTOR_KEY]: MSGS_ACK_CONSTRUCTOR,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('with offset', () => {
    expect(loadMsgsAck(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSGS_ACK_TYPE,
        [CONSTRUCTOR_KEY]: MSGS_ACK_CONSTRUCTOR,
        msgIds: [
          BigInt('0x5e0b700a00000000'),
          BigInt('0x5e0b800e00000000'),
        ],
      },
      offset: 28,
    });
  });
});
