import { FUTURE_SALT_TYPE, TYPE_KEY } from '../../constants';
import dumpFutureSalt from './dumpFutureSalt';
import { arrayBufferToHex } from '../../utils';

describe('dumpFutureSalt', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: FUTURE_SALT_TYPE,
      validSince: 256,
      validUntil: 65536,
      salt: BigInt(257),
    };

    const buffer = dumpFutureSalt(msg);

    const hexStr = 'dcd9490900010000000001000101000000000000';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
