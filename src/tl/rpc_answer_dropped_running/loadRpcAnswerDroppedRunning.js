import * as R from 'ramda';

import { RPC_ANSWER_DROPPED_RUNNING_TYPE, TYPE_KEY } from '../../constants';
import { isWithOffset } from '../../utils';

const msg = {
  value: {
    [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE,
  },
  offset: 4,
};

const getMsgWithOffset = R.always(msg);

export default R.cond([
  [isWithOffset, getMsgWithOffset],
  [R.T, R.pipe(getMsgWithOffset, R.prop('value'))],
]);
