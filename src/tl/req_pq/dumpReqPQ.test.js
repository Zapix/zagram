import {
  CONSTRUCTOR_KEY, REQ_PQ_CONSTRUCTOR, RES_PQ_TYPE, TYPE_KEY,
} from '../../constants';
import dumpReqPQ from './dumpReqPQ';
import { arrayBufferToHex } from '../../utils';

describe('dumpReqPQ', () => {
  it('test', () => {
    const resPQ = {
      [TYPE_KEY]: RES_PQ_TYPE,
      [CONSTRUCTOR_KEY]: REQ_PQ_CONSTRUCTOR,
      nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
    };

    const buffer = dumpReqPQ(resPQ);

    const hexStr = '78974660fce2ec8fa401b366e927ca8c8249053e';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
