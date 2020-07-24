import * as R from 'ramda';
import { getFirstByte } from '../../utils';

export default R.pipe(
  getFirstByte,
  Boolean,
);
