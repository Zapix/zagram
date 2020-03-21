import loadsBool from './loadBool';

import { BOOL_FALSE, BOOL_TRUE } from '../../constants';

describe('bool', () => {
  it('false', () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = BOOL_FALSE;
    expect(loadsBool(buffer)).toEqual(false);
  });

  it('true', () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = BOOL_TRUE;
    expect(loadsBool(buffer)).toEqual(true);
  });

  it('with offset', () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = BOOL_TRUE;
    expect(loadsBool(buffer, true)).toEqual({ value: true, offset: 4 });
  });
});
