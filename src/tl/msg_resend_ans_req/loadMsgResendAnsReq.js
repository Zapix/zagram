import * as R from 'ramda';

import { isWithOffset, sliceBuffer } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadVector } from '../vector';
import { MSG_RESEND_ANS_REQ_TYPE, TYPE_KEY } from '../../constants';


const loadIdsWithOffset = R.pipe(
  R.partialRight(sliceBuffer, [4, undefined]),
  R.curry(loadVector)(loadBigInt, R.__, true),
);

const buildMsgResendReq = R.pipe(
  R.of,
  R.ap([R.always(MSG_RESEND_ANS_REQ_TYPE), R.prop('value')]),
  R.zipObj([TYPE_KEY, 'msgIds']),
);

const buildOffset = R.pipe(
  R.prop('offset'),
  R.add(4),
);

const buildWithOffset = R.pipe(
  R.of,
  R.ap([buildMsgResendReq, buildOffset]),
  R.zipObj(['value', 'offset']),
);

/**
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {{}}
 */
export default R.cond([
  [isWithOffset, R.pipe(R.nthArg(0), loadIdsWithOffset, buildWithOffset)],
  [R.T, R.pipe(R.nthArg(0), loadIdsWithOffset, buildMsgResendReq)],
]);
