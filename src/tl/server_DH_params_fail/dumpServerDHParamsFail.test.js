import {
  CONSTRUCTOR_KEY,
  SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
  SERVER_DH_PARAMS_TYPE,
  TYPE_KEY,
} from '../../constants';
import dumpServerDHParamsFail from './dumpServerDHParamsFail';
import { arrayBufferToHex } from '../../utils';

describe('dumpServerDHParamsFail', () => {
  it('test', () => {
    const obj = {
      [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
      [CONSTRUCTOR_KEY]: SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
      nonce: BigInt('0x8dcfcbf2ee27d8e785d1962ea1af3dd7'),
      server_nonce: BigInt('0x2f015ca9533aac03524a716ec11cd433'),
      new_nonce_hash: BigInt('0x5817189911221165924498422996457278'),
    };

    const buffer = dumpServerDHParamsFail(obj);

    /* eslint-disable */
    const hexStr = '5d04cb79d73dafa12e96d185e7d827eef2cbcf8d33d41cc16e714a5203ac3a53a95c012f78724596294298449265112211991817';
    /* eslint-enable */

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
