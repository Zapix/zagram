import * as R from 'ramda';

import { MESSAGE_CONTAINER_TYPE, TYPE_KEY } from '../../constants';
import { loadVector } from '../vector';
import loadMessage from './loadMessage';

/**
 * Takes message containers buffer and return list of message buffers for them
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {Function} load
 * @returns {Array<ArrayBuffer>}
 */
function loadMessageContainer(buffer, withOffset, load) {
  const loadMsg = R.partialRight(loadMessage, [load]);
  const { value: messages, offset } = loadVector(loadMsg, buffer, true);
  const value = {
    [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
    messages,
  };
  return withOffset ? { offset: offset + 4, value } : value;
}

export default R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), R.equals(true)), R.nth(-1)]),
  R.apply(loadMessageContainer),
));
