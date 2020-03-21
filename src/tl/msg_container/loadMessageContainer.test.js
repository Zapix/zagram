import * as R from 'ramda';

import loadMessageContainer from './loadMessageContainer';
import { hexToArrayBuffer } from '../../utils';
import { MESSAGE_CONTAINER_TYPE, TYPE_KEY } from '../../constants';

describe('loadMessageContainer', () => {
  /* eslint-disable */
  const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    const loadBody = jest.fn();
    loadBody
      .mockReturnValueOnce({
        value: 'my loaded value',
        offset: 28,
      })
      .mockReturnValue({
        value: 'another loaded value',
        offset: 20,
      });

    const load = R.partialRight(loadMessageContainer, [loadBody]);

    expect(load(buffer)).toEqual({
      [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
      messages: [
        {
          msgId: BigInt('6775433945381679105'),
          seqNo: 1,
          bytes: 28,
          body: 'my loaded value',
        },
        {
          msgId: BigInt('6775433945381693441'),
          seqNo: 2,
          bytes: 20,
          body: 'another loaded value',
        },
      ],
    });
  });

  it('with offset', () => {
    const loadBody = jest.fn();
    loadBody
      .mockReturnValueOnce({
        value: 'my loaded value',
        offset: 28,
      })
      .mockReturnValue({
        value: 'another loaded value',
        offset: 20,
      });

    const load = R.partialRight(loadMessageContainer, [loadBody]);
    expect(load(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
        messages: [
          {
            msgId: BigInt('6775433945381679105'),
            seqNo: 1,
            bytes: 28,
            body: 'my loaded value',
          },
          {
            msgId: BigInt('6775433945381693441'),
            seqNo: 2,
            bytes: 20,
            body: 'another loaded value',
          },
        ],
      },
      offset: 92,
    });
  });
});
