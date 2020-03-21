import loadRpcDropAnswer from './loadRpcDropAnswer';
import { hexToArrayBuffer } from '../../utils';
import { RPC_DROP_ANSWER_TYPE, TYPE_KEY } from '../../constants';

describe('loadRpcDropAnswer', () => {
  const hexStr = '40a7e458000000000e800b5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('without offset', () => {
    expect(loadRpcDropAnswer(buffer)).toEqual({
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('with offset', () => {
    expect(loadRpcDropAnswer(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
        reqMsgId: BigInt('0x5e0b800e00000000'),
      },
      offset: 12,
    });
  });
});
