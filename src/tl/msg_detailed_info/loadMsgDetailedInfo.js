import { buildTypeLoader, buildConstructorLoader, buildLoadFunc } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import {
  CONSTRUCTOR_KEY,
  MSG_DETAILED_INFO_CONSTRUCTOR,
  MSG_DETAILED_INFO_TYPE,
  TYPE_KEY,
} from '../../constants';

const loadType = buildTypeLoader(MSG_DETAILED_INFO_TYPE);
const loadConstructor = buildConstructorLoader(MSG_DETAILED_INFO_CONSTRUCTOR);
const loadMsgId = loadBigInt;
const loadAnswerMsgId = loadBigInt;
const loadBytes = loadInt;
const loadStatus = loadInt;

/**
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default buildLoadFunc([
  [TYPE_KEY, loadType],
  [CONSTRUCTOR_KEY, loadConstructor],
  ['msgId', loadMsgId],
  ['answerMsgId', loadAnswerMsgId],
  ['bytes', loadBytes],
  ['status', loadStatus],
]);
