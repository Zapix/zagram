import { RPC_ERROR_TYPE, TYPE_KEY } from '../../constants';
import dumpRpcError from './dumpRpcError';
import { arrayBufferToHex } from '../../utils';

describe('dumpRpcError', () => {
  it('test', () => {
    const msg = {
      [TYPE_KEY]: RPC_ERROR_TYPE,
      errorCode: 18,
      errorMessage: 'Hello World!',
    };

    const buffer = dumpRpcError(msg);

    const hex = '19ca4421120000000c48656c6c6f20576f726c6421000000';

    expect(arrayBufferToHex(buffer)).toEqual(hex);
  });
});
