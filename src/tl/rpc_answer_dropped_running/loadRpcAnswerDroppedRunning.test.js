import { hexToArrayBuffer } from '../../utils';
import loadRpcAnswerDroppedRunning from './loadRpcAnswerDroppedRunning';
import {
  CONSTRUCTOR_KEY,
  RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
  RPC_DROP_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadRpcAnswerDroppedRunning', () => {
  const hexStr = '86e578cd';
  const buffer = hexToArrayBuffer(hexStr);

  it('with offset', () => {
    expect(loadRpcAnswerDroppedRunning(buffer)).toEqual({
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      [CONSTRUCTOR_KEY]: RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
    });
  });

  it('without offset', () => {
    expect(loadRpcAnswerDroppedRunning(buffer, true)).toEqual({
      offset: 4,
      value: {
        [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
        [CONSTRUCTOR_KEY]: RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
      },
    });
  });
});
