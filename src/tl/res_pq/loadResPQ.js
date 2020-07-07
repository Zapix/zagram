import * as R from 'ramda';

import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  TYPE_KEY, CONSTRUCTOR_KEY, RES_PQ_CONSTRUCTOR, RES_PQ_TYPE,
} from '../../constants';
import { loadBigInt128 } from '../bigInt128';
import { loadBytes } from '../bytes';
import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(RES_PQ_TYPE);
const loadConstructor = buildConstructorLoader(RES_PQ_CONSTRUCTOR);
const loadNonce = loadBigInt128;
const loadServerNonce = loadBigInt128;
const loadPQ = loadBytes;
const loadFingerprints = R.partial(loadVector, [loadBigInt]);

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['nonce', loadNonce],
  ['server_nonce', loadServerNonce],
  ['pq', loadPQ],
  ['fingerprints', loadFingerprints],
]);
