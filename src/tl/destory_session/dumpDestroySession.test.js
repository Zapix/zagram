import { DESTROY_SESSION_TYPE, TYPE_KEY } from '../../constants';
import dumpDestroySession from './dumpDestroySession';
import { arrayBufferToHex } from '../../utils';

it('dumpDestroySession', () => {
  const msg = {
    [TYPE_KEY]: DESTROY_SESSION_TYPE,
    sessionId: BigInt('0x56efe14fe8ab347e'),
  };
  const buffer = dumpDestroySession(msg);

  const hexStr = '262151e77e34abe84fe1ef56';
  expect(arrayBufferToHex(buffer)).toEqual(hexStr);
});
