import * as R from 'ramda';

import { hexToArrayBuffer } from '../../utils';
import loadMessage from './loadMessage';

describe('loadMessage', () => {
  /* eslint-disable */
  const hexStr = '01309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
  /* eslint-enable */

  const loadBody = jest.fn();
  loadBody.mockReturnValue({
    value: 'my loaded value',
    offset: 28,
  });
  const load = R.partialRight(loadMessage, [loadBody]);

  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(load(buffer)).toMatchObject({
      msgId: BigInt('0x5e072d4689993001'),
      seqNo: 1,
      bytes: 28,
      body: 'my loaded value',
    });
  });

  it('with offset', () => {
    expect(load(buffer, true)).toMatchObject({
      value: {
        msgId: BigInt('0x5e072d4689993001'),
        seqNo: 1,
        bytes: 28,
        body: 'my loaded value',
      },
      offset: 44,
    });
  });
});
