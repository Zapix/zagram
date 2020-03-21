import {
  NEW_SESSION_CREATED_TYPE,
  TYPE_KEY,
} from '../../constants';
import { arrayBufferToHex, hexToArrayBuffer } from '../../utils';

import dumpMessage from './dumpMessage';

describe('dumpMessage', () => {
  it('test', () => {
    const msg = {
      msgId: BigInt('0x5e072d4689993001'),
      seqNo: 1,
      body: {
        [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
        firstMsgId: BigInt('0x5e072d4500000000'),
        uniqueId: BigInt('0x8f5524a763de8c07'),
        serverSalt: BigInt('0x6b02abc667623eb7'),
      },
    };

    const dump = jest.fn();
    dump
      .mockReturnValueOnce(
        hexToArrayBuffer('0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b'),
      );

    const buffer = dumpMessage(msg, dump);

    /* eslint-disable */
    const hexStr = '01309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    /* eslint-enable */

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
