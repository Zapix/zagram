import { GET_FUTURE_SALTS, TYPE_KEY } from '../../constants';
import dumpGetFutureSalts from './dumpGetFutureSalts';
import { arrayBufferToHex } from '../../utils';

describe('dumpGetFutureSalts', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: GET_FUTURE_SALTS,
      num: 18,
    };

    const buffer = dumpGetFutureSalts(msg);

    const hexStr = '04bd21b912000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
