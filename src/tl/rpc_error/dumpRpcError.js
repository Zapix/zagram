import * as R from 'ramda';
import { RPC_ERROR } from '../../constants';
import { dumpInt } from '../int';
import { dumpString } from '../string';
import { getEmptyArrayBuffer, mergeArrayBuffer } from '../../utils';

const dumpType = R.pipe(R.always(RPC_ERROR), dumpInt);
const dumpErrorCode = R.pipe(R.prop('errorCode'), dumpInt);
const dumpErrorMessage = R.pipe(R.prop('errorMessage'), dumpString);


/**
 * Dumps rpc error
 * @param {*} value - rpc error message
 * @returns
 *
 */
export default R.pipe(
  R.of,
  R.ap([dumpType, dumpErrorCode, dumpErrorMessage]),
  R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
);
