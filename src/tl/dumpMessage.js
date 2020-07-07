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
  HTTP_WAIT_CONSTRUCTOR,
  MESSAGE_CONTAINER_CONSTRUCTOR,
  MSG_DETAILED_INFO_CONSTRUCTOR,
  MSG_NEW_DETAILED_INFO_CONSTRUCTOR,
  MSG_RESEND_ANS_REQ_METHOD,
  MSG_RESEND_REQ_METHOD,
  MSGS_ACK_CONSTRUCTOR,
  MSGS_ALL_INFO_CONSTRUCTOR,
  MSGS_STATE_INFO_CONSTRUCTOR,
  MSGS_STATE_REQ_METHOD,
  NEW_SESSION_CREATED_CONSTRUCTOR,
  PING_DELAY_DISCONNECT_METHOD,
  PING_METHOD,
  PONG_CONSTRUCTOR,
  RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR,
  RPC_ANSWER_DROPPED_CONSTRUCTOR,
  RPC_ANSWER_UNKNOWN_CONSTRUCTOR,
  RPC_DROP_ANSWER_METHOD,
  RPC_ERROR_CONSTRUCTOR,
  RPC_RESULT_CONSTRUCTOR,
  REQ_PQ_METHOD, RES_PQ_CONSTRUCTOR, PQ_INNER_DATA_CONSTRUCTOR,
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
import { isMessageOf, isMethodOf } from './utils';
import { dumpReqPQ } from './req_pq';
import { dumpResPQ } from './res_pq';
import { dumpPQInnerData } from './p_q_inner_data';


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
    [isMessageOf(HTTP_WAIT_CONSTRUCTOR), dumpHttpWait],
    [isMessageOf(MESSAGE_CONTAINER_CONSTRUCTOR), R.partialRight(dumpMessageContainer, [dump])],
    [isMessageOf(MSG_DETAILED_INFO_CONSTRUCTOR), dumpMsgDetailedInfo],
    [isMessageOf(MSG_NEW_DETAILED_INFO_CONSTRUCTOR), dumpMsgNewDetailedInfo],
    [isMethodOf(MSG_RESEND_ANS_REQ_METHOD), dumpMsgResendAnsReq],
    [isMethodOf(MSG_RESEND_REQ_METHOD), dumpMsgResendReq],
    [isMessageOf(MSGS_ACK_CONSTRUCTOR), dumpMsgsAck],
    [isMessageOf(MSGS_ALL_INFO_CONSTRUCTOR), dumpMsgsAllInfo],
    [isMessageOf(MSGS_STATE_INFO_CONSTRUCTOR), dumpMsgsStateInfo],
    [isMethodOf(MSGS_STATE_REQ_METHOD), dumpMsgsStateReq],
    [isMessageOf(NEW_SESSION_CREATED_CONSTRUCTOR), dumpNewSessionCreated],
    [isMethodOf(PING_METHOD), dumpPing],
    [isMethodOf(PING_DELAY_DISCONNECT_METHOD), dumpPingDelayDisconnect],
    [isMessageOf(PONG_CONSTRUCTOR), dumpPong],
    [isMessageOf(RPC_ANSWER_DROPPED_CONSTRUCTOR), dumpRpcAnswerDropped],
    [isMessageOf(RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR), dumpRpcAnswerDroppedRunning],
    [isMessageOf(RPC_ANSWER_UNKNOWN_CONSTRUCTOR), dumpRpcAnswerUnknown],
    [isMethodOf(RPC_DROP_ANSWER_METHOD), dumpRpcDropAnswer],
    [isMessageOf(RPC_ERROR_CONSTRUCTOR), dumpRpcError],
    [isMessageOf(RPC_RESULT_CONSTRUCTOR), R.partialRight(dumpRpcResult, [dump])],
    [isMethodOf(REQ_PQ_METHOD), dumpReqPQ],
    [isMessageOf(RES_PQ_CONSTRUCTOR), dumpResPQ],
    [isMessageOf(PQ_INNER_DATA_CONSTRUCTOR), dumpPQInnerData],
    [R.partial(isMsgCouldBeDump, [schema]), R.partial(dumpBySchema, [schema])],
    [R.T, dumpUnexpectedMessage],
  ])(msg);
}
