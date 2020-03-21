import dumpBool from './dumpBool';
import { BOOL_FALSE, BOOL_TRUE } from '../../constants';

describe('dumbBool', () => {
  it('false', () => {
    expect((new Uint32Array(dumpBool(false)))[0]).toEqual(BOOL_FALSE);
  });

  it('true', () => {
    expect((new Uint32Array(dumpBool(true)))[0]).toEqual(BOOL_TRUE);
  });
});
