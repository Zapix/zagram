import dumpInt from './dumpInt';

describe('dumpInt', () => {
  it('test', () => {
    expect((new Uint32Array(dumpInt(32)))[0]).toEqual(32);
  });
});
