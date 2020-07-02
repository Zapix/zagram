import {
  FUTURE_SALTS_TYPE, GET_FUTURE_SALTS, METHOD_KEY, TYPE_KEY,
} from '../../constants';
import dumpGetFutureSalts from './dumpGetFutureSalts';
import { arrayBufferToHex } from '../../utils';

describe('dumpGetFutureSalts', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: FUTURE_SALTS_TYPE,
      [METHOD_KEY]: GET_FUTURE_SALTS,
      num: 18,
    };

    const buffer = dumpGetFutureSalts(msg);

    const hexStr = '04bd21b912000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
