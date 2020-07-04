import { hexToArrayBuffer } from '../../utils';
import loadBigInt256 from './loadBigInt256';

describe('loadBigInt', () => {
  it('test', () => {
    //              3E 05 49 82 8C CA 27 E9 66 B3 01 A4 8F EC E2 FC
    const hexStr = 'fce2ec8fa401b366e927ca8c8249053efce2ec8fa401b366e927ca8c8249053e';
    const buffer = hexToArrayBuffer(hexStr);
    expect(loadBigInt256(buffer))
      .toEqual(BigInt('0x3E0549828CCA27E966B301A48FECE2FC3E0549828CCA27E966B301A48FECE2FC'));
  });

  it('with offset', () => {
    const hexStr = 'fce2ec8fa401b366e927ca8c8249053efce2ec8fa401b366e927ca8c8249053e';
    const buffer = hexToArrayBuffer(hexStr);
    expect(loadBigInt256(buffer, true)).toEqual({
      value: BigInt('0x3E0549828CCA27E966B301A48FECE2FC3E0549828CCA27E966B301A48FECE2FC'),
      offset: 32,
    });
  });
});
