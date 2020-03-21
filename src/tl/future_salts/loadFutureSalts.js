import * as R from 'ramda';

import { buildTypeLoader, buildLoadFunc } from '../../utils';
import { FUTURE_SALTS_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';
import { loadVector } from '../vector';
import { loadFutureSalt } from '../future_salt';
import { loadInt } from '../int';

const loadType = buildTypeLoader(FUTURE_SALTS_TYPE);
const loadReqMsgId = loadBigInt;
const loadNow = loadInt;
const loadSalts = R.partial(loadVector, [loadFutureSalt]);

/**
 * future_salts#ae500895 req_msg_id:long now:int salts:vector future_salt = FutureSalts;
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['reqMsgId', loadReqMsgId],
  ['now', loadNow],
  ['salts', loadSalts],
]);
