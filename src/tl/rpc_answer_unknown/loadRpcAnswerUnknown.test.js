import { hexToArrayBuffer } from '../../utils';
import loadRpcAnswerUnknown from './loadRpcAnswerUnknown';
import {
  CONSTRUCTOR_KEY,
  RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
  RPC_DROP_ANSWER_TYPE,
  TYPE_KEY,
} from '../../constants';

describe('loadRpcAnswerUnknown', () => {
  const hexStr = '6ed32a5e';
  const buffer = hexToArrayBuffer(hexStr);

  it('with offset', () => {
    expect(loadRpcAnswerUnknown(buffer)).toEqual({
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      [CONSTRUCTOR_KEY]: RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
    });
  });

  it('without offset', () => {
    expect(loadRpcAnswerUnknown(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
        [CONSTRUCTOR_KEY]: RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
      },
      offset: 4,
    });
  });
});
