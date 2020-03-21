import * as R from 'ramda';

import { toTlString } from '../tlSerialization';
import { uint8ToArrayBuffer } from '../../utils';

export default R.pipe(
  toTlString,
  uint8ToArrayBuffer,
);
