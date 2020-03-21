import * as R from 'ramda';

import { numberToHex, dumpArrayBuffer } from '../utils';

import {
  isPong,
  isNewSessionCreated,
  isMessageContainer,
  isBadMsgNotification,
  isMsgsAck,
  getConstructor,
  isRpcResult,
  isBadServerSalt,
  isMsgsStateReq,
  isMsgsStateInfo,
  isMsgsAllInfo,
  isMsgDetailedInfo,
  isMsgNewDetailedInfo,
  isMsgResendReq,
  isMsgResendAnsReq,
  isRpcError,
  isRpcDropAnswer,
  isRpcAnswerUnknown,
  isRpcAnswerDroppedRunning,
  isRpcAnswerDropped,
  isGetFutureSalts,
  isFutureSalt,
  isFutureSalts,
  isPing,
  isPingDelayDisconnect,
  isDestroySession,
  isDestroySessionOk,
  isDestroySessionNone,
  isHttpWait,
} from './utils';
import { loadMessageContainer } from './msg_container';
import { loadBadMsgNotification } from './bad_msg_notification';
import { loadBadServerSalt } from './bad_server_salt';
import { loadMsgsAck } from './msgs_ack';
import { loadRpcResult } from './rpc_result';
import { loadMsgsStateReq } from './msgs_state_req';
import { loadMsgsStateInfo } from './msgs_state_info';
import { loadMsgsAllInfo } from './msgs_all_info';
import { loadMsgDetailedInfo } from './msg_detailed_info';
import { loadMsgNewDetailedInfo } from './msg_new_detailed_info';
import { loadMsgResendReq } from './msg_resend_req';
import { loadMsgResendAnsReq } from './msg_resend_ans_req';
import { loadRpcError } from './rpc_error';
import { loadRpcDropAnswer } from './rpc_drop_answer';
import { loadRpcAnswerUnknown } from './rpc_answer_unknown';
import { loadRpcAnswerDroppedRunning } from './rpc_answer_dropped_running';
import { loadRpcAnswerDropped } from './rpc_answer_dropped';
import { loadGetFutureSalts } from './get_future_salts';
import { loadFutureSalt } from './future_salt';
import { loadFutureSalts } from './future_salts';
import { loadPing } from './ping';
import { loadPong } from './pong';
import { loadPingDelayDisconnect } from './ping_delay_disconnect';
import { loadDestroySession } from './destory_session';
import { loadDestroySessionOk } from './destory_session_ok';
import { loadDestroySessionNone } from './destory_session_none';
import { loadNewSessionCreated } from './new_session_created';
import { loadHttpWait } from './http_wait';
import { loadBySchema, isFromSchemaFactory } from './schema';

/**
 * Writes warning message into console and returns null
 * @param {ArrayBuffer} buffer;
 * @returns {null}
 */
const parseUnexpectedMessage = R.pipe(
  R.nthArg(0),
  R.of,
  R.ap([
    R.pipe(getConstructor, numberToHex),
    dumpArrayBuffer,
  ]),
  (x) => {
    console.warn(`Unexpected message constructor: ${x[0]}`);
    console.warn(x[1]);
  },
  R.always(null),
);

/**
 * Takes array buffer of encoded message and returns message as parsed object or
 * list of parsed objects
 * @param {{constructors: *, methods: *}} schema - schema that should be used for dumping objects
 * @param {ArrayBuffer} buffer
 * @param {boolean} [withOffset]
 * @returns {Array<*> | *}
 */
export default function loadMessage(schema, buffer, withOffset) {
  const load = R.partial(loadMessage, [schema]);
  return R.cond([
    [isHttpWait, loadHttpWait],
    [isPong, loadPong],
    [isPing, loadPing],
    [isPingDelayDisconnect, loadPingDelayDisconnect],
    [isNewSessionCreated, loadNewSessionCreated],
    [isBadMsgNotification, loadBadMsgNotification],
    [isMsgsAck, loadMsgsAck],
    [isBadServerSalt, loadBadServerSalt],
    [isMsgsStateReq, loadMsgsStateReq],
    [isMsgsStateInfo, loadMsgsStateInfo],
    [isMsgsAllInfo, loadMsgsAllInfo],
    [isMsgDetailedInfo, loadMsgDetailedInfo],
    [isMsgNewDetailedInfo, loadMsgNewDetailedInfo],
    [isMsgResendReq, loadMsgResendReq],
    [isMsgResendAnsReq, loadMsgResendAnsReq],
    [isRpcError, loadRpcError],
    [isRpcDropAnswer, loadRpcDropAnswer],
    [isRpcAnswerUnknown, loadRpcAnswerUnknown],
    [isRpcAnswerDroppedRunning, loadRpcAnswerDroppedRunning],
    [isRpcAnswerDropped, loadRpcAnswerDropped],
    [isGetFutureSalts, loadGetFutureSalts],
    [isFutureSalt, loadFutureSalt],
    [isFutureSalts, loadFutureSalts],
    [isRpcResult, R.partialRight(loadRpcResult, [load])],
    [isDestroySession, loadDestroySession],
    [isDestroySessionOk, loadDestroySessionOk],
    [isDestroySessionNone, loadDestroySessionNone],
    [isMessageContainer, R.partialRight(loadMessageContainer, [load])],
    [isFromSchemaFactory(schema), R.partial(loadBySchema, [schema])],
    [R.T, parseUnexpectedMessage],
  ])(buffer, withOffset);
}
