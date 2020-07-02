import {
  CONSTRUCTOR_KEY,
  MSG_DETAILED_INFO_TYPE,
  MSG_NEW_DETAILED_INFO_CONSTRUCTOR,
  TYPE_KEY,
} from '../../constants';
import { buildLoadFunc, buildTypeLoader, buildConstructorLoader } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';

const loadType = buildTypeLoader(MSG_DETAILED_INFO_TYPE);
const loadConstructor = buildConstructorLoader(MSG_NEW_DETAILED_INFO_CONSTRUCTOR);
const loadAnswerMsgId = loadBigInt;
const loadBytes = loadInt;
const loadStatus = loadInt;

/**
 * @param {ArrayBuffer} buffer
 * @param {Boolean} withOffset
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['answerMsgId', loadAnswerMsgId],
  ['bytes', loadBytes],
  ['status', loadStatus],
]);
