import { buildConstructorLoader, buildLoadFunc, buildTypeLoader } from '../../utils';
import {
  CONSTRUCTOR_KEY,
  HTTP_WAIT_CONSTRUCTOR,
  HTTP_WAIT_TYPE,
  TYPE_KEY,
} from '../../constants';
import { loadInt } from '../int';

const loadType = buildTypeLoader(HTTP_WAIT_TYPE);
const loadConstructor = buildConstructorLoader(HTTP_WAIT_CONSTRUCTOR);
const loadMaxDelay = loadInt;
const loadWaitAfter = loadInt;
const loadMaxWait = loadInt;

/**
 * http_wait#9299359f max_delay:int wait_after:int max_wait:int = HttpWait;
 *
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['maxDelay', loadMaxDelay],
  ['waitAfter', loadWaitAfter],
  ['maxWait', loadMaxWait],
]);
