import * as R from 'ramda';

import { RPC_ANSWER_DROPPED_RUNNING } from '../../constants';
import { dumpInt } from '../int';

export default R.pipe(R.always(RPC_ANSWER_DROPPED_RUNNING), dumpInt);
