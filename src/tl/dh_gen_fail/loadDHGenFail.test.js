import { hexToArrayBuffer } from '../../utils';
import loadDHGenFail from './loadDHGenFail';
import {
  CONSTRUCTOR_KEY,
  DH_GEN_FAIL_CONSTRUCTOR,
  SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadDHGenFail', () => {
  /* eslint-disable */
  const hexStr = '02ae9da6f5b6f649f4908fbcce50566571697fdc427dfaf6208ee417f29ec7354822c1d255365936e687cc182b941d6f9c60a292'
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadDHGenFail(buffer)).toEqual({
      [TYPE_KEY]: SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
      [CONSTRUCTOR_KEY]: DH_GEN_FAIL_CONSTRUCTOR,
      nonce: BigInt('0xdc7f6971655650cebc8f90f449f6b6f5'),
      server_nonce: BigInt('0xd2c1224835c79ef217e48e20f6fa7d42'),
      new_nonce_hash3: BigInt('0x92a2609c6f1d942b18cc87e636593655'),
    });
  });

  it('with offset', () => {
    expect(loadDHGenFail(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
        [CONSTRUCTOR_KEY]: DH_GEN_FAIL_CONSTRUCTOR,
        nonce: BigInt('0xdc7f6971655650cebc8f90f449f6b6f5'),
        server_nonce: BigInt('0xd2c1224835c79ef217e48e20f6fa7d42'),
        new_nonce_hash3: BigInt('0x92a2609c6f1d942b18cc87e636593655'),
      },
      offset: 52,
    });
  });
});
