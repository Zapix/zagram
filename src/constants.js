// Values from my.telegram.com
export const BOOL_TRUE = 0x997275b5;
export const BOOL_FALSE = 0xbc799737;

export const TYPE_KEY = '@@type';
export const CONSTRUCTOR_KEY = '@@constructor';
export const METHOD_KEY = '@@method';

export const API_ID = 1005944;
export const API_HASH = 'dfbf8ed1e37d1cd1ad370e7431ed8a87';

export const PROTOCOL_ID = 0xdddddddd; //
export const DC_ID = 0b0100000000000000; // DC-2 in little endian form
export const TEST_DC_INC = 10000; // INCREMENT DC FOR TEST

export const RES_PQ_TYPE = 'ResPQ';
export const REQ_PQ_METHOD = 'req_pq';
export const REQ_PQ = 0x60469778;

export const RES_PQ = 0x05162463;
export const RES_PQ_CONSTRUCTOR = 'resPQ';

export const PQ_INNER_DATA_TYPE = 'P_Q_inner_data';
export const PQ_INNER_DATA_CONSTRUCTOR = 'p_q_inner_data';
export const PQ_INNER_DATA = 0x83c95aec;
export const PQ_INNER_DATA_TEMP_CONSTRUCTOR = 'p_q_inner_data_temp';
export const PQ_INNER_DATA_TEMP = 0x3c6a84d4;

export const SERVER_DH_PARAMS_TYPE = 'Server_DH_Params';
export const REQ_DH_PARAMS_METHOD = 'req_DH_params';
export const REQ_DH_PARAMS = 0xd712e4be;

export const SERVER_DH_PARAMS_FAIL_CONSTRUCTOR = 'server_DH_params_fail';
export const SERVER_DH_PARAMS_FAIL = 0x79cb045d;
export const SERVER_DH_PARAMS_OK_CONSTRUCTOR = 'server_DH_params_ok';
export const SERVER_DH_PARAMS_OK = 0xd0e8075c;

export const SERVER_DH_INNER_DATA_TYPE = 'Server_DH_inner_data';
export const SERVER_DH_INNER_DATA_CONSTRUCTOR = 'server_DH_inner_data';
export const SERVER_DH_INNER_DATA = 0xb5890dba;

export const CLIENT_DH_INNER_DATA_TYPE = 'Client_DH_Inner_Data';
export const CLIENT_DH_INNER_DATA_CONSTRUCTOR = 'client_DH_inner_data';
export const CLIENT_DH_INNER_DATA = 0x6643b654;

export const SET_CLIENT_DH_PARAMS_ANSWER_TYPE = 'Set_client_DH_params_answer';
export const SET_CLIENT_DH_PARAMS_METHOD = 'set_client_DH_params';
export const SET_CLIENT_DH_PARAMS = 0xf5045f1f;

export const DH_GEN_OK_CONSTRUCTOR = 'dh_gen_ok';
export const DH_GEN_OK = 0x3bcbf734;
export const DH_GEN_RETRY_CONSTRUCTOR = 'dh_gen_retry';
export const DH_GEN_RETRY = 0x46dc1fb9;
export const DH_GEN_FAIL_CONSTRUCTOR = 'dh_gen_fail';
export const DH_GEN_FAIL = 0xa69dae02;

export const AUTH_SEND_CODE = 0xa677244f;
export const AUTH_SENT_CODE = 0x2215bcbd;
export const CODE_SETTINGS = 0xdebebe83;

export const PONG_TYPE = 'Pong';
export const PING = 0x7abe77ec;
export const PING_METHOD = 'ping';
export const PONG = 0x347773c5;
export const PONG_CONSTRUCTOR = 'pong';

export const PING_DELAY_DISCONNECT = 0xf3427b8c;
export const PING_DELAY_DISCONNECT_METHOD = 'ping_delay_disconnect';

export const GET_CONFIG = 0xc4f9186b;

export const GET_NEAREST_DC = 0x1fb33026;

export const HTTP_WAIT_TYPE = 'HttpWait';
export const HTTP_WAIT = 0x9299359f;
export const HTTP_WAIT_CONSTRUCTOR = 'http_wait';

export const MESSAGE_CONTAINER_TYPE = 'MessageContainer';
export const MESSAGE_CONTAINER = 0x73f1f8dc;
export const MESSAGE_CONTAINER_CONSTRUCTOR = 'msg_container';

export const NEW_SESSION_CREATED_TYPE = 'NewSession';
export const NEW_SESSION_CREATED = 0x9ec20908;
export const NEW_SESSION_CREATED_CONSTRUCTOR = 'new_session_created';

export const BAD_MSG_NOTIFICATION_TYPE = 'BadMsgNotification';
export const BAD_MSG_NOTIFICATION = 0xa7eff811;
export const BAD_MSG_NOTIFICATION_CONSTRUCTOR = 'bad_msg_notification';

export const BAD_SERVER_SALT = 0xedab447b;
export const BAD_SERVER_SALT_CONSTRUCTOR = 'bad_server_salt';

export const MSGS_ACK_TYPE = 'MsgsAck';
export const MSGS_ACK = 0x62d6b459;
export const MSGS_ACK_CONSTRUCTOR = 'msgs_ack';

export const MSGS_STATE_REQ_TYPE = 'MsgsStateReq';
export const MSGS_STATE_REQ = 0xda69fb52;
export const MSGS_STATE_REQ_METHOD = 'msgs_state_req';

export const MSGS_STATE_INFO_TYPE = 'MsgsStateInfo';
export const MSGS_STATE_INFO = 0x04deb57d;
export const MSGS_STATE_INFO_CONSTRUCTOR = 'msgs_state_info';

export const MSGS_ALL_INFO_TYPE = 'MsgsAllInfo';
export const MSGS_ALL_INFO = 0x8cc0d131;
export const MSGS_ALL_INFO_CONSTRUCTOR = 'msgs_all_info';

export const MSG_DETAILED_INFO_TYPE = 'MsgDetailedInfo';
export const MSG_DETAILED_INFO_CONSTRUCTOR = 'msg_detailed_info';
export const MSG_DETAILED_INFO = 0x276d3ec6;

export const MSG_NEW_DETAILED_INFO = 0x809db6df;
export const MSG_NEW_DETAILED_INFO_CONSTRUCTOR = 'msg_new_detailed_info';

export const MSG_RESEND_REQ_TYPE = 'MsgResendReq';
export const MSG_RESEND_REQ = 0x7d861a08;
export const MSG_RESEND_REQ_METHOD = 'msg_resend_req_type';

export const MSG_RESEND_ANS_REQ = 0x8610baeb;
export const MSG_RESEND_ANS_REQ_METHOD = 'msg_resend_ans_req';

export const VECTOR = 0x1cb5c415;

export const RPC_RESULT_TYPE = 'RpcResult';
export const RPC_RESULT = 0xf35c6d01;
export const RPC_RESULT_CONSTRUCTOR = 'rpc_result';

export const RPC_DROP_ANSWER_TYPE = 'RpcDropAnswer';
export const RPC_DROP_ANSWER = 0x58e4a740;
export const RPC_DROP_ANSWER_METHOD = 'rpc_drop_answer';

export const RPC_ANSWER_UNKNOWN = 0x5e2ad36e;
export const RPC_ANSWER_UNKNOWN_CONSTRUCTOR = 'rpc_answer_unknown';

export const RPC_ANSWER_DROPPED_RUNNING = 0xcd78e586;
export const RPC_ANSWER_DROPPED_RUNNING_CONSTRUCTOR = 'rpc_answer_dropped_running';

export const RPC_ANSWER_DROPPED = 0xa43ad8b7;
export const RPC_ANSWER_DROPPED_CONSTRUCTOR = 'rpc_answer_dropped';

export const RPC_ERROR_TYPE = 'RpcError';
export const RPC_ERROR = 0x2144ca19;
export const RPC_ERROR_CONSTRUCTOR = 'rpc_error_type';

export const GET_FUTURE_SALTS = 0xb921bd04;
export const GET_FUTURE_SALTS_METHOD = 'get_future_salts';

export const FUTURE_SALTS_TYPE = 'FutureSalts';
export const FUTURE_SALT = 0x0949d9dc;
export const FUTURE_SALT_CONSTRUCTOR = 'future_salt';

export const FUTURE_SALTS = 0xae500895;
export const FUTURE_SALTS_CONSTRUCTOR = 'future_salts';

export const DESTROY_SESSION_TYPE = 'DestroySessionRes';
export const DESTROY_SESSION = 0xe7512126;
export const DESTROY_SESSION_CONSTRUCTOR = 'destroy_session';

export const DESTROY_SESSION_OK = 0xe22045fc;
export const DESTROY_SESSION_OK_CONSTRUCTOR = 'destroy_session_ok';

export const DESTROY_SESSION_NONE = 0x62d350c9;
export const DESTROY_SESSION_NONE_CONSTRUCTOR = 'destroy_session_none';

export const GZIP_PACKED = 0x3072cfa1;
