import { RPC_DROP_ANSWER_TYPE, TYPE_KEY } from '../../constants';
import dumpRpcDropAnswer from './dumpRpcDropAnswer';
import { arrayBufferToHex } from '../../utils';

describe('dumpRpcDropAnswer', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
    };
    const buffer = dumpRpcDropAnswer(msg);

    const hexStr = '40a7e458000000000e800b5e';
    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
