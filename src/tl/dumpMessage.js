import * as R from 'ramda';

import { dumpBadMsgNotification } from './bad_msg_notification';
import {
  BAD_MSG_NOTIFICATION_TYPE,
  BAD_SERVER_SALT_TYPE,
  DESTROY_SESSION_NONE_TYPE,
  DESTROY_SESSION_OK_TYPE,
  DESTROY_SESSION_TYPE,
  FUTURE_SALT_TYPE,
  FUTURE_SALTS_TYPE,
  GET_FUTURE_SALTS_TYPE,
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
import { isMessageOf } from './utils';


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
    [isMessageOf(BAD_MSG_NOTIFICATION_TYPE), dumpBadMsgNotification],
    [isMessageOf(BAD_SERVER_SALT_TYPE), dumpBadServerSalt],
    [isMessageOf(DESTROY_SESSION_TYPE), dumpDestroySession],
    [isMessageOf(DESTROY_SESSION_NONE_TYPE), dumpDestroySessionNone],
    [isMessageOf(DESTROY_SESSION_OK_TYPE), dumpDestroySessionOk],
    [isMessageOf(FUTURE_SALT_TYPE), dumpFutureSalt],
    [isMessageOf(FUTURE_SALTS_TYPE), dumpFutureSalts],
    [isMessageOf(GET_FUTURE_SALTS_TYPE), dumpGetFutureSalts],
    [isMessageOf(HTTP_WAIT_TYPE), dumpHttpWait],
    [isMessageOf(MESSAGE_CONTAINER_TYPE), R.partialRight(dumpMessageContainer, [dump])],
    [isMessageOf(MSG_DETAILED_INFO_TYPE), dumpMsgDetailedInfo],
    [isMessageOf(MSG_NEW_DETAILED_INFO_TYPE), dumpMsgNewDetailedInfo],
    [isMessageOf(MSG_RESEND_ANS_REQ_TYPE), dumpMsgResendAnsReq],
    [isMessageOf(MSG_RESEND_REQ_TYPE), dumpMsgResendReq],
    [isMessageOf(MSGS_ACK_TYPE), dumpMsgsAck],
    [isMessageOf(MSGS_ALL_INFO_TYPE), dumpMsgsAllInfo],
    [isMessageOf(MSGS_STATE_INFO_TYPE), dumpMsgsStateInfo],
    [isMessageOf(MSGS_STATE_REQ_TYPE), dumpMsgsStateReq],
    [isMessageOf(NEW_SESSION_CREATED_TYPE), dumpNewSessionCreated],
    [isMessageOf(PING_TYPE), dumpPing],
    [isMessageOf(PING_DELAY_DISCONNECT_TYPE), dumpPingDelayDisconnect],
    [isMessageOf(PONG_TYPE), dumpPong],
    [isMessageOf(RPC_ANSWER_DROPPED_TYPE), dumpRpcAnswerDropped],
    [isMessageOf(RPC_ANSWER_DROPPED_RUNNING_TYPE), dumpRpcAnswerDroppedRunning],
    [isMessageOf(RPC_ANSWER_UNKNOWN_TYPE), dumpRpcAnswerUnknown],
    [isMessageOf(RPC_DROP_ANSWER_TYPE), dumpRpcDropAnswer],
    [isMessageOf(RPC_ERROR_TYPE), dumpRpcError],
    [isMessageOf(RPC_RESULT_TYPE), R.partialRight(dumpRpcResult, [dump])],
    [R.partial(isMsgCouldBeDump, [schema]), R.partial(dumpBySchema, [schema])],
    [R.T, dumpUnexpectedMessage],
  ])(msg);
}
