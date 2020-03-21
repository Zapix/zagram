import { hexToArrayBuffer } from '../../utils';
import loadGetFutureSalts from './loadGetFutureSalts';
import { GET_FUTURE_SALTS, TYPE_KEY } from '../../constants';

describe('loadGetFutreSalts', () => {
  const hexStr = '04bd21b912000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadGetFutureSalts(buffer)).toEqual({
      [TYPE_KEY]: GET_FUTURE_SALTS,
      num: 18,
    });
  });

  it('with offset', () => {
    expect(loadGetFutureSalts(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: GET_FUTURE_SALTS,
        num: 18,
      },
      offset: 8,
    });
  });
});
