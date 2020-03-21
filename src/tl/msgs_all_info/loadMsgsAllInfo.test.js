import { hexToArrayBuffer } from '../../utils';
import loadMsgsAllInfo from './loadMsgsAllInfo';
import { MSGS_ALL_INFO_TYPE, TYPE_KEY } from '../../constants';

describe('loadMsgsAllInfo', () => {
  // constructor 8c c0 d1 31
  // Vector 15c4b51c02000000000000000a700b5e000000000e800b5e
  // value [12, 13]

  const hexStr = '31d1c08c15c4b51c02000000000000000a700b5e000000000e800b5e020c0d00';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadMsgsAllInfo(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
      info: [12, 13],
    });
  });

  it('with offset', () => {
    expect(loadMsgsAllInfo(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
        msgIds: [
          BigInt('0x5e0b700a00000000'),
          BigInt('0x5e0b800e00000000'),
        ],
        info: [12, 13],
      },
      offset: 32,
    });
  });
});
