import { RPC_ANSWER_UNKNOWN_TYPE, TYPE_KEY } from '../../constants';

import dumpRpcAnswerUnknown from './dumpRpcAnswerUnknown';
import { arrayBufferToHex } from '../../utils';

describe('dumpRpcAnswerUnknown', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: RPC_ANSWER_UNKNOWN_TYPE,
    };

    const buffer = dumpRpcAnswerUnknown(msg);

    const hexStr = '6ed32a5e';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
