import {
  CONSTRUCTOR_KEY,
  DESTROY_SESSION_NONE_CONSTRUCTOR,
  DESTROY_SESSION_TYPE,
  TYPE_KEY,
} from '../../constants';
import dumpDestroySessionNone from './dumpDestroySessionNone';
import { arrayBufferToHex } from '../../utils';

it('dumpDestroySession', () => {
  const msg = {
    [TYPE_KEY]: DESTROY_SESSION_TYPE,
    [CONSTRUCTOR_KEY]: DESTROY_SESSION_NONE_CONSTRUCTOR,
    sessionId: BigInt('0x56efe14fe8ab347e'),
  };
  const buffer = dumpDestroySessionNone(msg);

  const hexStr = 'c950d3627e34abe84fe1ef56';
  expect(arrayBufferToHex(buffer)).toEqual(hexStr);
});
