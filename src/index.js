import { partial } from 'ramda';

/* eslint-disable */
import { dumps, loads } from './tl';
import { default as schema_ } from './tl/schema/layer108.json';
import{
  constructorFromSchema as constructorFromSchema_,
  methodFromSchema as methodFromSchema_
} from './tl';
export { isMessageOf } from './tl/utils';
export { isObjectOf, isMethodOf } from './tl/schema/utils';

export { TYPE_KEY, CONSTRUCTOR_KEY, METHOD_KEY } from './constants';
export { default as MTProto } from './MTProto';


export const schema = schema_;

export const methodFromSchema = methodFromSchema_;
export const constructorFromSchema = constructorFromSchema_;

export const method = partial(methodFromSchema, [schema]);
export const construct = partial(constructorFromSchema, [schema]);

export const tlDumps = dumps;
export const tlLoads = loads;

