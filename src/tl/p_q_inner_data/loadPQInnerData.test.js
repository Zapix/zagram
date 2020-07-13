import { hexToArrayBuffer } from '../../utils';
import loadPQInnerData from './loadPQInnerData';
import {
  CONSTRUCTOR_KEY,
  PQ_INNER_DATA_CONSTRUCTOR,
  PQ_INNER_DATA_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadPQInnerData', () => {
  /* eslint-disable */
  const hexStr = 'ec5ac9830818c85e03b53e434300000004493dd0d900000004569f637b0000006813462dcecf0a9b9670bca3a9044dd8c8662799d2ab2ae0f8eac72f44db66e149d49b4934ef1c6499929a12a005c0fc59dbe316f51b3cf51f9682d7cb209c80';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadPQInnerData(buffer)).toEqual({
      [TYPE_KEY]: PQ_INNER_DATA_TYPE,
      [CONSTRUCTOR_KEY]: PQ_INNER_DATA_CONSTRUCTOR,
      pq: [24, 200, 94, 3, 181, 62, 67, 67],
      p: [73, 61, 208, 217],
      q: [86, 159, 99, 123],
      nonce: BigInt('287513148517520756130170381589593592680'),
      server_nonce: BigInt('299610360581182355831673463144976967368'),
      /* eslint-disable */
      new_nonce: BigInt('58171899112211659244984229964572781128134817992388846608035515552309198967881'),
      /* eslint-enable */
    });
  });

  it('with offset', () => {
    expect(loadPQInnerData(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: PQ_INNER_DATA_TYPE,
        [CONSTRUCTOR_KEY]: PQ_INNER_DATA_CONSTRUCTOR,
        pq: [24, 200, 94, 3, 181, 62, 67, 67],
        p: [73, 61, 208, 217],
        q: [86, 159, 99, 123],
        nonce: BigInt('287513148517520756130170381589593592680'),
        server_nonce: BigInt('299610360581182355831673463144976967368'),
        /* eslint-disable */
        new_nonce: BigInt('58171899112211659244984229964572781128134817992388846608035515552309198967881'),
        /* eslint-enable */
      },
      offset: 96,
    });
  });
});
