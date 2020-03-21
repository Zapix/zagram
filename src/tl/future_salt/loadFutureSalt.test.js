import loadFutureSalt from './loadFutureSalt';
import { hexToArrayBuffer } from '../../utils';
import { FUTURE_SALT_TYPE, TYPE_KEY } from '../../constants';

describe('loadFutureSalt', () => {
  // future_salt#0949d9dc valid_since:int valid_until:int salt:long = FutureSalt;
  const hexStr = 'dcd9490900010000000001000101000000000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadFutureSalt(buffer)).toEqual({
      [TYPE_KEY]: FUTURE_SALT_TYPE,
      validSince: 256,
      validUntil: 65536,
      salt: BigInt(257),
    });
  });

  it('with offset', () => {
    expect(loadFutureSalt(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: FUTURE_SALT_TYPE,
        validSince: 256,
        validUntil: 65536,
        salt: BigInt(257),
      },
      offset: 20,
    });
  });
});
