import * as R from 'ramda';

import loadString from './loadString';
import dumpString from './dumpString';

describe('dumpString', () => {
  it('test', () => {
    expect(R.pipe(dumpString, loadString)('hello world')).toEqual('hello world');
  });
});
