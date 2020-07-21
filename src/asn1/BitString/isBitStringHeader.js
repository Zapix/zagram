import * as R from 'ramda';

export default R.pipe(
  R.prop('blockId'),
  R.equals(3),
);
