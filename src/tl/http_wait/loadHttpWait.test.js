import { hexToArrayBuffer } from '../../utils';
import loadHttpWait from './loadHttpWait';
import { HTTP_WAIT_TYPE, TYPE_KEY } from '../../constants';

describe('loadHttpWait', () => {
  const hexStr = '9f3599920000000000000000a8610000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadHttpWait(buffer)).toEqual({
      [TYPE_KEY]: HTTP_WAIT_TYPE,
      maxDelay: 0,
      waitAfter: 0,
      maxWait: 25000,
    });
  });

  it('with offset', () => {
    expect(loadHttpWait(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: HTTP_WAIT_TYPE,
        maxDelay: 0,
        waitAfter: 0,
        maxWait: 25000,
      },
      offset: 16,
    });
  });
});
