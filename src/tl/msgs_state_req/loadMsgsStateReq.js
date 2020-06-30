import * as R from 'ramda';

import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import {
  METHOD_KEY, MSGS_STATE_REQ_METHOD, MSGS_STATE_REQ_TYPE, TYPE_KEY,
} from '../../constants';
import { buildLoadFunc, buildTypeLoader, buildMethodLoader } from '../../utils';

const loadType = buildTypeLoader(MSGS_STATE_REQ_TYPE);
const loadMethod = buildMethodLoader(MSGS_STATE_REQ_METHOD);
const loadMsgIds = R.partial(loadVector, [loadBigInt]);

/**
 * @param {ArrayBuffer} buffer,
 * @param {Boolean} withOffset
 * @return {*}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [METHOD_KEY, loadMethod],
  ['msgIds', loadMsgIds],
]);
