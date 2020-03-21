import * as R from 'ramda';
import { toTlString, fromTlString } from './tlSerialization';

describe('toTlString', () => {
  test('short string length 4', () => {
    expect(toTlString([1, 2, 3, 4])).toEqual([4, 1, 2, 3, 4, 0, 0, 0]);
  });

  test('short string length 13', () => {
    expect(
      toTlString([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
    ).toEqual([13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 0]);
  });

  test('short string length 3', () => {
    expect(toTlString([1, 2, 3])).toEqual([3, 1, 2, 3]);
  });

  test('long string length 256', () => {
    const longStr = R.times(R.identity, 256);

    expect(toTlString(longStr)).toEqual([254, 0, 1, 0].concat(longStr));
  });

  test('long string length 257', () => {
    const longStr = R.times(R.identity, 257);

    expect(toTlString(longStr)).toEqual([254, 1, 1, 0].concat(longStr).concat([0, 0, 0]));
  });
});

describe('fromTlString', () => {
  test('short string length 4', () => {
    expect(fromTlString([4, 1, 2, 3, 4, 0, 0, 0])).toEqual([1, 2, 3, 4]);
  });

  test('short string length 13', () => {
    expect(
      fromTlString([13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 0]),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  test('short string length 3', () => {
    expect(fromTlString([3, 1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('long string length 256', () => {
    const longStr = R.times(R.identity, 256);
    const tlString = [254, 0, 1, 0].concat(longStr);

    expect(fromTlString(tlString)).toEqual(longStr);
  });

  test('long string length 257', () => {
    const longStr = R.times(R.identity, 257);
    const tlString = [254, 1, 1, 0].concat(longStr).concat([0, 0, 0]);
    expect(fromTlString(tlString)).toEqual(longStr);
  });
});
