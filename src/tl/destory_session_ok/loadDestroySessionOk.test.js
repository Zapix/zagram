import { hexToArrayBuffer } from '../../utils';
import loadDestroySessionOk from './loadDestroySessionOk';
import { DESTROY_SESSION_OK_TYPE, TYPE_KEY } from '../../constants';

describe('loadDestroySession', () => {
  // e22045fc
  const hexStr = 'fc4520e27e34abe84fe1ef56';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadDestroySessionOk(buffer)).toEqual({
      [TYPE_KEY]: DESTROY_SESSION_OK_TYPE,
      sessionId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('with offset', () => {
    expect(loadDestroySessionOk(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: DESTROY_SESSION_OK_TYPE,
        sessionId: BigInt('0x56efe14fe8ab347e'),
      },
      offset: 12,
    });
  });
});
