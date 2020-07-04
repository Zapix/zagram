import dumpBigInt256 from './dumpBigInt256';
import { arrayBufferToHex } from '../../utils';

describe('dumpBigInt', () => {
  it('test', () => {
    const value = BigInt('0x3E0549828CCA27E966B301A48FECE2FC3E0549828CCA27E966B301A48FECE2FC');

    const hexStr = 'fce2ec8fa401b366e927ca8c8249053efce2ec8fa401b366e927ca8c8249053e';

    const buffer = dumpBigInt256(value);

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
