import { hexToArrayBuffer } from '../../utils';
import loadDestroySessionNone from './loadDestroySessionNone';
import { DESTROY_SESSION_NONE_TYPE, TYPE_KEY } from '../../constants';

describe('loadDestroySession', () => {
  const hexStr = 'c950d3627e34abe84fe1ef56';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadDestroySessionNone(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_NONE_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('with offset', () => {
    expect(loadDestroySessionNone(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: DESTROY_SESSION_NONE_TYPE,
        sessionId: BigInt('0x56efe14fe8ab347e'),
      },
      offset: 12,
    });
  });
});
