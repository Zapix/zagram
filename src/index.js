/* eslint-disable */
import { dumps, loads } from './tl';
import { default as schema_ } from './tl/schema/layer108.json';
import{
  constructorFromSchema as constructorFromSchema_,
  methodFromSchema as methodFromSchema_
} from './tl';
import { isMessageOfType } from './tl/utils';
import { RPC_ERROR_TYPE, PROTOCOL_ID } from './constants';
import { getInitialDHExchangeMessage } from './createAuthorizationKey';
export { isMessageOfType, isMessageOf } from './tl/utils';
export { isObjectOf, isMethodOf } from './tl/schema/utils';
export { dumpString, loadString} from './tl/string';
export { default as Connection } from './Connection';
export { default as getObfuscation } from './obfuscation'
export { tag, decode as padDecode, encode as padEncode} from './intermediate';
export { getInitialDHExchangeMessage } from './createAuthorizationKey';
export {sha256} from './sha';
export {
  mergeAllArrayBuffers,
  mergeArrayBuffer,
  uint8ToBigInt,
  uint8ToArrayBuffer,
  arrayBufferToUint8Array,
  arrayBufferToHex,
  hexToArrayBuffer,
  bigIntToUint8Array,
  powModulo,
} from './utils'

export { TYPE_KEY, CONSTRUCTOR_KEY, METHOD_KEY, RPC_ERROR_TYPE } from './constants';
export { default as MTProto } from './MTProto';


export const schema = schema_;

export const methodFromSchema = methodFromSchema_;
export const constructorFromSchema = constructorFromSchema_;

export const method = partial(methodFromSchema, [schema]);
export const construct = partial(constructorFromSchema, [schema]);
export const isRpcError = isMessageOfType(RPC_ERROR_TYPE);

export const tlDumps = dumps;
export const tlLoads = loads;
