import { hexToArrayBuffer } from '../../utils';
import loadPong from './loadPong';
import { PONG_TYPE, TYPE_KEY } from '../../constants';

describe('loadPong', () => {
  const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadPong(buffer)).toEqual({
      [TYPE_KEY]: PONG_TYPE,
      msgId: BigInt('0x5e072d4500000000'),
      pingId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('with offset', () => {
    expect(loadPong(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: PONG_TYPE,
        msgId: BigInt('0x5e072d4500000000'),
        pingId: BigInt('0x56efe14fe8ab347e'),
      },
      offset: 20,
    });
  });
});
