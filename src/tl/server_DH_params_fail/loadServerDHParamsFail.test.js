import { hexToArrayBuffer } from '../../utils';
import loadServerDHParamsFail from './loadServerDHParamsFail';
import {
  CONSTRUCTOR_KEY,
  SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
  SERVER_DH_PARAMS_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadServerDHParamsFail', () => {
  /* eslint-disable */
  const hexStr = '5d04cb79d73dafa12e96d185e7d827eef2cbcf8d33d41cc16e714a5203ac3a53a95c012f78724596299844926511229918175832';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadServerDHParamsFail(buffer)).toEqual({
      [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
      [CONSTRUCTOR_KEY]: SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
      nonce: BigInt('0x8dcfcbf2ee27d8e785d1962ea1af3dd7'),
      server_nonce: BigInt('0x2f015ca9533aac03524a716ec11cd433'),
      new_nonce_hash: BigInt('66918790357086034941688659190623859320'),
    });
  });

  it('with offset', () => {
    expect(loadServerDHParamsFail(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
        [CONSTRUCTOR_KEY]: SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
        nonce: BigInt('0x8dcfcbf2ee27d8e785d1962ea1af3dd7'),
        server_nonce: BigInt('0x2f015ca9533aac03524a716ec11cd433'),
        new_nonce_hash: BigInt('66918790357086034941688659190623859320'),
      },
      offset: 52,
    });
  });
});
