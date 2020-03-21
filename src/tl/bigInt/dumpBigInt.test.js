import dumpBigInt from './dumpBigInt';

describe('dumpBigInt', () => {
  it('test', () => {
    expect((new BigUint64Array(dumpBigInt(BigInt(12))))[0]).toEqual(BigInt(12));
  });
});
