import { hexToArrayBuffer } from '../../utils';
import loadRpcAnswerDropped from './loadRpcAnswerDropped';
import { RPC_ANSWER_DROPPED_TYPE, TYPE_KEY } from '../../constants';

describe('loadRpcAnswerDropped', () => {
  const hexStr = 'b7d83aa4000000000e800b5e1c000000ff000000';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadRpcAnswerDropped(buffer)).toEqual({
      [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
      msgId: BigInt('0x5e0b800e00000000'),
      seqNo: 28,
      bytes: 255,
    });
  });

  it('with offset', () => {
    expect(loadRpcAnswerDropped(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
        msgId: BigInt('0x5e0b800e00000000'),
        seqNo: 28,
        bytes: 255,
      },
      offset: 20,
    });
  });
});
