import { HTTP_WAIT_TYPE, TYPE_KEY } from '../../constants';
import dumpHttpWait from './dumpHttpWait';
import { arrayBufferToHex } from '../../utils';

test('dumpHttpWait', () => {
  const msg = {
    [TYPE_KEY]: HTTP_WAIT_TYPE,
    maxDelay: 0,
    waitAfter: 0,
    maxWait: 25000,
  };

  const buffer = dumpHttpWait(msg);
  const hexStr = '9f3599920000000000000000a8610000';
  expect(arrayBufferToHex(buffer)).toEqual(hexStr);
});
