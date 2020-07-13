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
  isGzipped,
  isReqPQ,
  isResPQ,
  isPQInnerData,
  isPQInnerDataTemp,
  isReqDhParams,
  isServerDHParamsFail,
  isServerDHParamsOk,
  isServerDHInnerData,
  isClienDHInnerData,
  isSetClientDHParams, isDHGenOk, isDHGenRetry, isDHGenFail,
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
import { loadReqPQ } from './req_pq';
import { loadBySchema, isFromSchemaFactory } from './schema';
import unzipMessage from './unzipMessage';
import { loadResPQ } from './res_pq';
import { loadPQInnerData } from './p_q_inner_data';
import { loadPQInnerDataTemp } from './p_q_inner_data_temp';
import { loadReqDHParams } from './req_DH_params';
import { loadServerDHParamsFail } from './server_DH_params_fail';
import { loadServerDHParamsOk } from './server_DH_params_ok';
import { loadServerDHInnerData } from './server_DH_inner_data';
import { loadClientDHInnerData } from './client_DH_inner_data';
import { loadSetClientDHParams } from './set_client_DH_params';
import { loadDHGenOk } from './dh_gen_ok';
import { loadDHGenRetry } from './dh_gen_retry';
import { loadDHGenFail } from './dh_gen_fail';

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
    [isGzipped, R.partialRight(unzipMessage, [load])],
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
    [isReqPQ, loadReqPQ],
    [isResPQ, loadResPQ],
    [isPQInnerData, loadPQInnerData],
    [isPQInnerDataTemp, loadPQInnerDataTemp],
    [isReqDhParams, loadReqDHParams],
    [isServerDHParamsFail, loadServerDHParamsFail],
    [isServerDHParamsOk, loadServerDHParamsOk],
    [isServerDHInnerData, loadServerDHInnerData],
    [isClienDHInnerData, loadClientDHInnerData],
    [isSetClientDHParams, loadSetClientDHParams],
    [isDHGenOk, loadDHGenOk],
    [isDHGenRetry, loadDHGenRetry],
    [isDHGenFail, loadDHGenFail],
    [isFromSchemaFactory(schema), R.partial(loadBySchema, [schema])],
    [R.T, parseUnexpectedMessage],
  ])(buffer, withOffset);
}
