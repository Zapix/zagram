import { partial } from 'ramda';

/* eslint-disable */
import { dumps, loads } from './tl';
import { default as schema_ } from './tl/schema/layer108.json';
import{
  constructorFromSchema as constructorFromSchema_,
  methodFromSchema as methodFromSchema_
} from './tl';

export { TYPE_KEY } from './constants';
export { default as MTProto } from './MTProto';


export const schema = schema_;

export const methodFromSchema = methodFromSchema_;
export const constructorFromSchema = constructorFromSchema_;

export const method = partial(methodFromSchema, [schema]);
export const constructor = partial(constructorFromSchema, [schema]);

export const tlDumps = dumps;
export const tlLoads = loads;

