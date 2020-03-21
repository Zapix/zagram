import { FUTURE_SALT_TYPE, FUTURE_SALTS_TYPE, TYPE_KEY } from '../../constants';
import dumpFutureSalts from './dumpFutureSalts';
import { arrayBufferToHex } from '../../utils';

describe('dumpFutureSalts', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: FUTURE_SALTS_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
      now: 255,
      salts: [
        {
          [TYPE_KEY]: FUTURE_SALT_TYPE,
          validSince: 256,
          validUntil: 65536,
          salt: BigInt(257),
        },
        {
          [TYPE_KEY]: FUTURE_SALT_TYPE,
          validSince: 65537,
          validUntil: 16777216,
          salt: BigInt(4369),
        },
      ],
    };

    const buffer = dumpFutureSalts(msg);

    /* eslint-disable */
    const hexStr = '950850ae000000000e800b5eff00000015c4b51c02000000dcd9490900010000000001000101000000000000dcd9490901000100000000011111000000000000';
    /* eslint-enable */

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
