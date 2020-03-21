import {
  MESSAGE_CONTAINER,
  NEW_SESSION_CREATED_TYPE,
  PONG_TYPE,
  TYPE_KEY,
} from '../../constants';
import { arrayBufferToHex, hexToArrayBuffer } from '../../utils';

import dumpMessageContainer from './dumpMessageContainer';

describe('dumpMessage', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: MESSAGE_CONTAINER,
      messages: [
        {
          msgId: BigInt('0x5e072d4689993001'),
          seqNo: 1,
          body: {
            [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
            firstMsgId: BigInt('0x5e072d4500000000'),
            uniqueId: BigInt('0x8f5524a763de8c07'),
            serverSalt: BigInt('0x6b02abc667623eb7'),
          },
        },
        {
          msgId: BigInt('0x5e072d4689996801'),
          seqNo: 2,
          body: {
            [TYPE_KEY]: PONG_TYPE,
            msgId: BigInt('0x5e072d4500000000'),
            pingId: BigInt('0x56efe14fe8ab347e'),
          },
        },
      ],
    };

    const dump = jest.fn();
    dump
      .mockReturnValueOnce(
        hexToArrayBuffer('0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b'),
      )
      .mockReturnValueOnce(
        hexToArrayBuffer('c573773400000000452d075e7e34abe84fe1ef56'),
      );

    const buffer = dumpMessageContainer(msg, dump);

    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
