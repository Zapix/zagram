import { hexToArrayBuffer } from '../../utils';
import loadNewSessionCreated from './loadNewSessionCreated';
import { NEW_SESSION_CREATED_TYPE, TYPE_KEY } from '../../constants';

describe('loadNewSessionCreated', () => {
  const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadNewSessionCreated(buffer)).toEqual({
      [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
      firstMsgId: BigInt('0x5e072d4500000000'),
      uniqueId: BigInt('0x8f5524a763de8c07'),
      serverSalt: BigInt('0x6b02abc667623eb7'),
    });
  });

  it('with offset', () => {
    expect(loadNewSessionCreated(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: NEW_SESSION_CREATED_TYPE,
        firstMsgId: BigInt('0x5e072d4500000000'),
        uniqueId: BigInt('0x8f5524a763de8c07'),
        serverSalt: BigInt('0x6b02abc667623eb7'),
      },
      offset: 28,
    });
  });
});
