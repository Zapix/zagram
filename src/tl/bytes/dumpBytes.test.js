import { arrayBufferToHex } from '../../utils';

import dumpBytes from './dumpBytes';

describe('dumpBytes', () => {
  it('test', () => {
    const bytes = [12, 14, 1, 15];
    const buffer = dumpBytes(bytes);

    expect(arrayBufferToHex(buffer)).toEqual('040c0e010f000000');
  });
});
