import * as R from 'ramda';
import {
  AUTH_SENT_CODE,
  BAD_MSG_NOTIFICATION,
  BAD_SERVER_SALT,
  CLIENT_DH_INNER_DATA,
  CONSTRUCTOR_KEY,
  DESTROY_SESSION,
  DESTROY_SESSION_NONE,
  DESTROY_SESSION_OK, DH_GEN_FAIL, DH_GEN_OK, DH_GEN_RETRY,
  FUTURE_SALT,
  FUTURE_SALTS,
  GET_FUTURE_SALTS,
  GZIP_PACKED,
  HTTP_WAIT,
  MESSAGE_CONTAINER,
  METHOD_KEY,
  MSG_DETAILED_INFO,
  MSG_NEW_DETAILED_INFO,
  MSG_RESEND_ANS_REQ,
  MSG_RESEND_REQ,
  MSGS_ACK,
  MSGS_ALL_INFO,
  MSGS_STATE_INFO,
  MSGS_STATE_REQ,
  NEW_SESSION_CREATED,
  PING,
  PING_DELAY_DISCONNECT,
  PONG,
  PQ_INNER_DATA,
  PQ_INNER_DATA_TEMP,
  REQ_DH_PARAMS,
  REQ_PQ,
  RES_PQ,
  RPC_ANSWER_DROPPED,
  RPC_ANSWER_DROPPED_RUNNING,
  RPC_ANSWER_UNKNOWN,
  RPC_DROP_ANSWER,
  RPC_ERROR,
  RPC_RESULT,
  SERVER_DH_INNER_DATA,
  SERVER_DH_PARAMS_FAIL,
  SERVER_DH_PARAMS_OK,
  SET_CLIENT_DH_PARAMS,
  TYPE_KEY,
  VECTOR,
} from '../constants';

/**
 * Gets constructor value from buffer
 * @param {ArrayBuffer} - message buffer
 * @returns {Number} - constructor number
 */
export const getConstructor = R.pipe(
  (x) => new Uint32Array(x, 0, 1),
  R.nth(0),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMessageContainer = R.pipe(
  getConstructor,
  R.equals(MESSAGE_CONTAINER),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPong = R.pipe(
  getConstructor,
  R.equals(PONG),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPing = R.pipe(
  getConstructor,
  R.equals(PING),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPingDelayDisconnect = R.pipe(
  getConstructor,
  R.equals(PING_DELAY_DISCONNECT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isNewSessionCreated = R.pipe(
  getConstructor,
  R.equals(NEW_SESSION_CREATED),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isBadMsgNotification = R.pipe(
  getConstructor,
  R.equals(BAD_MSG_NOTIFICATION),
);

export const isBadServerSalt = R.pipe(
  getConstructor,
  R.equals(BAD_SERVER_SALT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsAck = R.pipe(
  getConstructor,
  R.equals(MSGS_ACK),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsStateReq = R.pipe(
  getConstructor,
  R.equals(MSGS_STATE_REQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsStateInfo = R.pipe(
  getConstructor,
  R.equals(MSGS_STATE_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsAllInfo = R.pipe(
  getConstructor,
  R.equals(MSGS_ALL_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgDetailedInfo = R.pipe(
  getConstructor,
  R.equals(MSG_DETAILED_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgNewDetailedInfo = R.pipe(
  getConstructor,
  R.equals(MSG_NEW_DETAILED_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgResendReq = R.pipe(
  getConstructor,
  R.equals(MSG_RESEND_REQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgResendAnsReq = R.pipe(
  getConstructor,
  R.equals(MSG_RESEND_ANS_REQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isVector = R.pipe(
  getConstructor,
  R.equals(VECTOR),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcResult = R.pipe(
  getConstructor,
  R.equals(RPC_RESULT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcError = R.pipe(
  getConstructor,
  R.equals(RPC_ERROR),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcDropAnswer = R.pipe(
  getConstructor,
  R.equals(RPC_DROP_ANSWER),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerUnknown = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_UNKNOWN),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerDroppedRunning = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_DROPPED_RUNNING),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerDropped = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_DROPPED),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isAuthSentCode = R.pipe(
  getConstructor,
  R.equals(AUTH_SENT_CODE),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isGetFutureSalts = R.pipe(
  getConstructor,
  R.equals(GET_FUTURE_SALTS),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isFutureSalt = R.pipe(
  getConstructor,
  R.equals(FUTURE_SALT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isFutureSalts = R.pipe(
  getConstructor,
  R.equals(FUTURE_SALTS),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDestroySession = R.pipe(
  getConstructor,
  R.equals(DESTROY_SESSION),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDestroySessionOk = R.pipe(
  getConstructor,
  R.equals(DESTROY_SESSION_OK),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDestroySessionNone = R.pipe(
  getConstructor,
  R.equals(DESTROY_SESSION_NONE),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isHttpWait = R.pipe(
  getConstructor,
  R.equals(HTTP_WAIT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isGzipped = R.pipe(
  getConstructor,
  R.equals(GZIP_PACKED),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isReqPQ = R.pipe(
  getConstructor,
  R.equals(REQ_PQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isResPQ = R.pipe(
  getConstructor,
  R.equals(RES_PQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPQInnerData = R.pipe(
  getConstructor,
  R.equals(PQ_INNER_DATA),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPQInnerDataTemp = R.pipe(
  getConstructor,
  R.equals(PQ_INNER_DATA_TEMP),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isReqDhParams = R.pipe(
  getConstructor,
  R.equals(REQ_DH_PARAMS),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isServerDHParamsFail = R.pipe(
  getConstructor,
  R.equals(SERVER_DH_PARAMS_FAIL),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isServerDHParamsOk = R.pipe(
  getConstructor,
  R.equals(SERVER_DH_PARAMS_OK),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isServerDHInnerData = R.pipe(
  getConstructor,
  R.equals(SERVER_DH_INNER_DATA),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isClienDHInnerData = R.pipe(
  getConstructor,
  R.equals(CLIENT_DH_INNER_DATA),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isSetClientDHParams = R.pipe(
  getConstructor,
  R.equals(SET_CLIENT_DH_PARAMS),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDHGenOk = R.pipe(
  getConstructor,
  R.equals(DH_GEN_OK),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDHGenRetry = R.pipe(
  getConstructor,
  R.equals(DH_GEN_RETRY),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isDHGenFail = R.pipe(
  getConstructor,
  R.equals(DH_GEN_FAIL),
);

export const isMessageOf = R.propEq(CONSTRUCTOR_KEY);

export const isMessageOfType = R.propEq(TYPE_KEY);

export const isMethodOf = R.propEq(METHOD_KEY);

export const toBigInt = (x) => BigInt(x);

const pow = (x, y) => x ** y;

export const add = (x, y) => x + y;

const base256 = R.pipe(toBigInt, R.partial(pow, [BigInt(256)]));

export const getBase = R.pipe(
  R.of,
  R.ap([
    R.identity,
    R.pipe(R.length, R.times(base256)),
  ]),
  R.apply(R.zip),
);
