import { hexToArrayBuffer } from '../../utils';
import loadReqPQ from './loadReqPQ';
import {
  METHOD_KEY,
  REQ_PQ_METHOD,
  RES_PQ_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadReqPQ', () => {
  const hexStr = '78974660fce2ec8fa401b366e927ca8c8249053e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadReqPQ(buffer)).toEqual({
      [TYPE_KEY]: RES_PQ_TYPE,
      [METHOD_KEY]: REQ_PQ_METHOD,
      nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
    });
  });

  it('with offset', () => {
    expect(loadReqPQ(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RES_PQ_TYPE,
        [METHOD_KEY]: REQ_PQ_METHOD,
        nonce: BigInt('0x3E0549828CCA27E966B301A48FECE2FC'),
      },
      offset: 20,
    });
  });
});
