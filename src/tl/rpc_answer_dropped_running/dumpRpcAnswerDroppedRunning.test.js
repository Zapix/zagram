import {
  RPC_ANSWER_DROPPED_RUNNING_TYPE,
  TYPE_KEY,
} from '../../constants';

import dumpRpcAnswerDroppedRunning from './dumpRpcAnswerDroppedRunning';
import { arrayBufferToHex } from '../../utils';

describe('dumpRpcAnswerUnknown', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE,
    };

    const buffer = dumpRpcAnswerDroppedRunning(msg);

    const hexStr = '86e578cd';

    expect(arrayBufferToHex(buffer)).toEqual(hexStr);
  });
});
