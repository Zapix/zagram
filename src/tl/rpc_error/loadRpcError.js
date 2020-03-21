import * as R from 'ramda';

import { RPC_ERROR_TYPE, TYPE_KEY } from '../../constants';
import { loadInt } from '../int';
import { loadString } from '../string';
import { computeOffset, isWithOffset, sliceBuffer } from '../../utils';

const loadType = R.always({ value: RPC_ERROR_TYPE, offset: 4 });
const loadErrorCode = R.partialRight(loadInt, [true]);
const loadErrorMessage = R.partialRight(loadString, [true]);

const loadDataWithOffset = R.pipe(
  R.of,
  R.ap([
    loadType,
    R.pipe(R.partialRight(sliceBuffer, [4, 8]), loadErrorCode),
    R.pipe(R.partialRight(sliceBuffer, [8, undefined]), loadErrorMessage),
  ]),
);

const buildRpcError = R.pipe(
  R.map(R.prop('value')),
  R.zipObj([TYPE_KEY, 'errorCode', 'errorMessage']),
);

const buildWithOffset = R.pipe(
  R.of,
  R.ap([buildRpcError, computeOffset]),
  R.zipObj(['value', 'offset']),
);

export default R.cond([
  [isWithOffset, R.pipe(loadDataWithOffset, buildWithOffset)],
  [R.T, R.pipe(loadDataWithOffset, buildRpcError)],
]);
