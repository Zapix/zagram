import { hexToArrayBuffer } from '../../utils';
import loadRpcAnswerDroppedRunning from './loadRpcAnswerDroppedRunning';
import { RPC_ANSWER_DROPPED_RUNNING_TYPE, TYPE_KEY } from '../../constants';

describe('loadRpcAnswerDroppedRunning', () => {
  const hexStr = '86e578cd';
  const buffer = hexToArrayBuffer(hexStr);

  it('with offset', () => {
    expect(loadRpcAnswerDroppedRunning(buffer)).toEqual({
      [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE,
    });
  });

  it('without offset', () => {
    expect(loadRpcAnswerDroppedRunning(buffer, true)).toEqual({
      offset: 4,
      value: {
        [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE,
      },
    });
  });
});
