import * as R from 'ramda';

import { dumpBadMsgNotification } from './bad_msg_notification';
import {
  BAD_MSG_NOTIFICATION_CONSTRUCTOR,
  BAD_SERVER_SALT_CONSTRUCTOR,
  DESTROY_SESSION_NONE_CONSTRUCTOR,
  DESTROY_SESSION_OK_CONSTRUCTOR,
  DESTROY_SESSION_CONSTRUCTOR,
  FUTURE_SALT_CONSTRUCTOR,
  FUTURE_SALTS_CONSTRUCTOR,
  GET_FUTURE_SALTS_METHOD,
  HTTP_WAIT_TYPE,
  MESSAGE_CONTAINER_TYPE,
  MSG_DETAILED_INFO_TYPE,
  MSG_NEW_DETAILED_INFO_TYPE,
  MSG_RESEND_ANS_REQ_TYPE,
  MSG_RESEND_REQ_TYPE,
  MSGS_ACK_TYPE,
  MSGS_ALL_INFO_TYPE,
  MSGS_STATE_INFO_TYPE,
  MSGS_STATE_REQ_TYPE,
  NEW_SESSION_CREATED_TYPE,
  PING_DELAY_DISCONNECT_TYPE,
  PING_TYPE,
  PONG_TYPE,
  RPC_ANSWER_DROPPED_RUNNING_TYPE,
  RPC_ANSWER_DROPPED_TYPE,
  RPC_ANSWER_UNKNOWN_TYPE,
  RPC_DROP_ANSWER_TYPE,
  RPC_ERROR_TYPE,
  RPC_RESULT_TYPE,
} from '../constants';
import { dumpBadServerSalt } from './bad_server_salt';
import { dumpDestroySession } from './destory_session';
import { dumpDestroySessionNone } from './destory_session_none';
import { dumpDestroySessionOk } from './destory_session_ok';
import { dumpFutureSalt } from './future_salt';
import { dumpFutureSalts } from './future_salts';
import { dumpGetFutureSalts } from './get_future_salts';
import { dumpHttpWait } from './http_wait';
import { dumpMessageContainer } from './msg_container';
import { dumpMsgDetailedInfo } from './msg_detailed_info';
import { dumpMsgNewDetailedInfo } from './msg_new_detailed_info';
import { dumpMsgResendAnsReq } from './msg_resend_ans_req';
import { dumpMsgResendReq } from './msg_resend_req';
import { dumpMsgsAck } from './msgs_ack';
import { dumpMsgsAllInfo } from './msgs_all_info';
import { dumpMsgsStateInfo } from './msgs_state_info';
import { dumpMsgsStateReq } from './msgs_state_req';
import { dumpNewSessionCreated } from './new_session_created';
import { dumpPing } from './ping';
import { dumpPingDelayDisconnect } from './ping_delay_disconnect';
import { dumpPong } from './pong';
import { dumpRpcAnswerDropped } from './rpc_answer_dropped';
import { dumpRpcAnswerDroppedRunning } from './rpc_answer_dropped_running';
import { dumpRpcAnswerUnknown } from './rpc_answer_unknown';
import { dumpRpcDropAnswer } from './rpc_drop_answer';
import { dumpRpcError } from './rpc_error';
import { dumpRpcResult } from './rpc_result';
import { dumpBySchema, isMsgCouldBeDump } from './schema';
import { isMessageOf, isMessageOfType, isMethodOf } from './utils';


/**
 * Dumps unexpected message as empty array. print error to console
 * @param x
 * @returns {ArrayBuffer}
 */
export const dumpUnexpectedMessage = (x) => {
  console.error('Can\'t dump unexpected message:', x);
  return new ArrayBuffer();
};

/**
 * Dumps any mt-proto message to array buffer
 * @param {{constructors: *, methods: *}} schema - schema that should be used for dumping objects
 * @param {*} msg
 * @returns {ArrayBuffer}
 */
export default function dumpMessage(schema, msg) {
  const dump = R.partial(dumpMessage, [schema]);

  return R.cond([
    [isMessageOf(BAD_MSG_NOTIFICATION_CONSTRUCTOR), dumpBadMsgNotification],
    [isMessageOf(BAD_SERVER_SALT_CONSTRUCTOR), dumpBadServerSalt],
    [isMessageOf(DESTROY_SESSION_CONSTRUCTOR), dumpDestroySession],
    [isMessageOf(DESTROY_SESSION_NONE_CONSTRUCTOR), dumpDestroySessionNone],
    [isMessageOf(DESTROY_SESSION_OK_CONSTRUCTOR), dumpDestroySessionOk],
    [isMessageOf(FUTURE_SALT_CONSTRUCTOR), dumpFutureSalt],
    [isMessageOf(FUTURE_SALTS_CONSTRUCTOR), dumpFutureSalts],
    [isMethodOf(GET_FUTURE_SALTS_METHOD), dumpGetFutureSalts],
    [isMessageOfType(HTTP_WAIT_TYPE), dumpHttpWait],
    [isMessageOfType(MESSAGE_CONTAINER_TYPE), R.partialRight(dumpMessageContainer, [dump])],
    [isMessageOfType(MSG_DETAILED_INFO_TYPE), dumpMsgDetailedInfo],
    [isMessageOfType(MSG_NEW_DETAILED_INFO_TYPE), dumpMsgNewDetailedInfo],
    [isMessageOfType(MSG_RESEND_ANS_REQ_TYPE), dumpMsgResendAnsReq],
    [isMessageOfType(MSG_RESEND_REQ_TYPE), dumpMsgResendReq],
    [isMessageOfType(MSGS_ACK_TYPE), dumpMsgsAck],
    [isMessageOfType(MSGS_ALL_INFO_TYPE), dumpMsgsAllInfo],
    [isMessageOfType(MSGS_STATE_INFO_TYPE), dumpMsgsStateInfo],
    [isMessageOfType(MSGS_STATE_REQ_TYPE), dumpMsgsStateReq],
    [isMessageOfType(NEW_SESSION_CREATED_TYPE), dumpNewSessionCreated],
    [isMessageOfType(PING_TYPE), dumpPing],
    [isMessageOfType(PING_DELAY_DISCONNECT_TYPE), dumpPingDelayDisconnect],
    [isMessageOfType(PONG_TYPE), dumpPong],
    [isMessageOfType(RPC_ANSWER_DROPPED_TYPE), dumpRpcAnswerDropped],
    [isMessageOfType(RPC_ANSWER_DROPPED_RUNNING_TYPE), dumpRpcAnswerDroppedRunning],
    [isMessageOfType(RPC_ANSWER_UNKNOWN_TYPE), dumpRpcAnswerUnknown],
    [isMessageOfType(RPC_DROP_ANSWER_TYPE), dumpRpcDropAnswer],
    [isMessageOfType(RPC_ERROR_TYPE), dumpRpcError],
    [isMessageOfType(RPC_RESULT_TYPE), R.partialRight(dumpRpcResult, [dump])],
    [R.partial(isMsgCouldBeDump, [schema]), R.partial(dumpBySchema, [schema])],
    [R.T, dumpUnexpectedMessage],
  ])(msg);
}
