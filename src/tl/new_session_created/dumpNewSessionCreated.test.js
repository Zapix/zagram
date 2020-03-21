import { NEW_SESSION_CREATED_TYPE, TYPE_KEY } from '../../constants';
import dumpNewSessionCreated from './dumpNewSessionCreated';
import { arrayBufferToHex } from '../../utils';

describe('dumpNewSessionCreated', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
      firstMsgId: BigInt('0x5e072d4500000000'),
      uniqueId: BigInt('0x8f5524a763de8c07'),
      serverSalt: BigInt('0x6b02abc667623eb7'),
    };

    const buffer = dumpNewSessionCreated(msg);
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
