import { hexToArrayBuffer } from '../../utils';
import loadRpcError from './loadRpcError';
import { RPC_ERROR_TYPE, TYPE_KEY } from '../../constants';

describe('loadRpcError', () => {
  const hex = '19ca4421120000000c48656c6c6f20576f726c6421000000';
  const buffer = hexToArrayBuffer(hex);

  it('without offset', () => {
    expect(loadRpcError(buffer)).toEqual({
      [TYPE_KEY]: RPC_ERROR_TYPE,
      errorCode: 0x12,
      errorMessage: 'Hello World!',
    });
  });

  it('with offset', () => {
    expect(loadRpcError(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RPC_ERROR_TYPE,
        errorCode: 0x12,
        errorMessage: 'Hello World!',
      },
      offset: 24,
    });
  });
});
