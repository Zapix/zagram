import { partial } from 'ramda';

/* eslint-disable */
import { dumps, loads } from './tl';
import { default as schema_ } from './tl/schema/layer108.json';
import{
  constructorFromSchema as constructorFromSchema_,
  methodFromSchema as methodFromSchema_
} from './tl';
import { isMessageOf } from './tl/utils';
import { RPC_ERROR_TYPE } from './constants';
export { isMessageOf } from './tl/utils';
export { isObjectOf, isMethodOf } from './tl/schema/utils';
export { dumpString, loadString} from './tl/string';
export {
  mergeAllArrayBuffers,
  mergeArrayBuffer,
  uint8ToBigInt,
  uint8ToArrayBuffer,
  arrayBufferToUint8Array,
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
export const isRpcError = isMessageOf(RPC_ERROR_TYPE);

export const tlDumps = dumps;
export const tlLoads = loads;

