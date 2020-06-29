import * as R from 'ramda';

import { buildLoadFunc, buildTypeLoader, buildMethodLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadVector } from '../vector';
import {
  METHOD_KEY,
  MSG_RESEND_ANS_REQ_METHOD,
  MSG_RESEND_REQ_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(MSG_RESEND_REQ_TYPE);
const loadMethod = buildMethodLoader(MSG_RESEND_ANS_REQ_METHOD);
const loadMsgIds = R.partial(loadVector, [loadBigInt]);

/**
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['msgIds', loadMsgIds],
]);
