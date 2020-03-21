import { DESTROY_SESSION_OK_TYPE, TYPE_KEY } from '../../constants';
import dumpDestroySessionOk from './dumpDestroySessionOk';
import { arrayBufferToHex } from '../../utils';

it('dumpDestroySession', () => {
  const msg = {
    [TYPE_KEY]: DESTROY_SESSION_OK_TYPE,
    sessionId: BigInt('0x56efe14fe8ab347e'),
  };
  const buffer = dumpDestroySessionOk(msg);

  const hexStr = 'fc4520e27e34abe84fe1ef56';
  expect(arrayBufferToHex(buffer)).toEqual(hexStr);
});
