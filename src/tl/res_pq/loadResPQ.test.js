import loadResPQ from './loadResPQ';
import { hexToArrayBuffer } from '../../utils';
import {
  CONSTRUCTOR_KEY, RES_PQ_CONSTRUCTOR, RES_PQ_TYPE, TYPE_KEY,
} from '../../constants';

describe('loadResPQ', () => {
  /* eslint-disable */
  //             63241605 9601b21496be06c287fb656c51807be7 71 4c 23 e7 7e f7 4d 32 2f 0d 6e ee 1e 11 29 27 081fab627fc407ef5d000000 15c4b51c01000000216be86c022bb4c3';
  const hexStr ='632416059601b21496be06c287fb656c51807be7714c23e77ef74d322f0d6eee1e112927081fab627fc407ef5d00000015c4b51c01000000216be86c022bb4c3';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadResPQ(buffer)).toEqual({
      [TYPE_KEY]: RES_PQ_TYPE,
      [CONSTRUCTOR_KEY]: RES_PQ_CONSTRUCTOR,
      nonce: BigInt('0xe77b80516c65fb87c206be9614b20196'),
      server_nonce: BigInt('0x2729111eee6e0d2f324df77ee7234c71'),
      pq: [0x1f, 0xab, 0x62, 0x7f, 0xc4, 0x07, 0xef, 0x5d],
      fingerprints: [BigInt('0xc3b42b026ce86b21')],
    });
  });

  it('with offset', () => {
    expect(loadResPQ(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RES_PQ_TYPE,
        [CONSTRUCTOR_KEY]: RES_PQ_CONSTRUCTOR,
        nonce: BigInt('0xe77b80516c65fb87c206be9614b20196'),
        server_nonce: BigInt('0x2729111eee6e0d2f324df77ee7234c71'),
        pq: [0x1f, 0xab, 0x62, 0x7f, 0xc4, 0x07, 0xef, 0x5d],
        fingerprints: [BigInt('0xc3b42b026ce86b21')],
      },
      offset: 64,
    });
  });
});
