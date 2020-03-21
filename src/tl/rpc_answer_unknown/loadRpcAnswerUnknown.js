import * as R from 'ramda';

import { RPC_DROP_ANSWER_TYPE, TYPE_KEY } from '../../constants';
import { isWithOffset } from '../../utils';

const msg = {
  value: {
    [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
  },
  offset: 4,
};

const getMsgWithOffset = R.always(msg);

export default R.cond([
  [isWithOffset, getMsgWithOffset],
  [R.T, R.pipe(getMsgWithOffset, R.prop('value'))],
]);
