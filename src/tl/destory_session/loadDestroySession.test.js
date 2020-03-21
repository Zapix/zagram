import { hexToArrayBuffer } from '../../utils';
import loadDestroySession from './loadDestroySession';
import { DESTROY_SESSION_TYPE, TYPE_KEY } from '../../constants';

describe('loadDestroySession', () => {
  const hexStr = '262151e77e34abe84fe1ef56';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadDestroySession(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('with offset', () => {
    expect(loadDestroySession(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: DESTROY_SESSION_TYPE,
        sessionId: BigInt('0x56efe14fe8ab347e'),
      },
      offset: 12,
    });
  });
});
