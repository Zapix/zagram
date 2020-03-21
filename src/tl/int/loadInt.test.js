import loadInt from './loadInt';

describe('loadInt', () => {
  it('parse', () => {
    const value = 345;
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = value;

    expect(loadInt(buffer)).toEqual(345);
  });

  it('with offset', () => {
    const value = 345;
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = value;

    expect(loadInt(buffer, true)).toEqual({ value: 345, offset: 4 });
  });
});
