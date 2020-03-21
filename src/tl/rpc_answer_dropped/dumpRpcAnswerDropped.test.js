import { RPC_ANSWER_DROPPED_TYPE, TYPE_KEY } from '../../constants';
import { arrayBufferToHex } from '../../utils';
import dumpRpcAnswerDropped from './dumpRpcAnswerDropped';

describe('dumpRpcAnswerDropped', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
      msgId: BigInt('0x5e0b800e00000000'),
      seqNo: 28,
      bytes: 255,
    };

    const buffer = dumpRpcAnswerDropped(msg);

    const hexStr = 'b7d83aa4000000000e800b5e1c000000ff000000';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
