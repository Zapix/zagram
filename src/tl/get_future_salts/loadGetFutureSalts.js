import * as R from 'ramda';

import { GET_FUTURE_SALTS, TYPE_KEY } from '../../constants';
import { buildLoadFunc } from '../../utils';
import { loadInt } from '../int';


const loadType = R.always({ value: GET_FUTURE_SALTS, offset: 4 });
const loadNum = loadInt;

export default buildLoadFunc([
  [TYPE_KEY, loadType],
  ['num', loadNum],
]);
