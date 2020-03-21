import * as R from 'ramda';

import { RPC_RESULT_TYPE, TYPE_KEY } from '../../constants';
import dumpRpcResult from './dumpRpcResult';
import { arrayBufferToHex } from '../../utils';

describe('dumpRpcResult', () => {
  const msg = {
    [TYPE_KEY]: RPC_RESULT_TYPE,
    msgId: BigInt('0x5e0b86bc00000000'),
    result: 0x12,
  };

  const dump = (x) => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint32Array(buffer);
    view[0] = x;
    return buffer;
  };

  const dumpRpc = R.partialRight(dumpRpcResult, [dump]);
  const buffer = dumpRpc(msg);

  const hexStr = '016d5cf300000000bc860b5e12000000';

  it('test', () => {
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
