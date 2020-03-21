import * as R from 'ramda';

import {
  isMethodObject,
  isConstuctorObject,
  getSchemaForMethod,
  getSchemaForConstructor,
  isVector,
  getVectorType,
  isDumpingTypeFactory,
  hasConditionalField,
  isFlagOption,
  flagOptionMatch,
  dumpFlag,
} from './utils';
import { getEmptyArrayBuffer, buildDumpFunc, mergeAllArrayBuffers } from '../../utils';
import { CONSTRUCTOR_KEY, METHOD_KEY } from '../../constants';
import { dumpInt } from '../int';
import { dumpBool } from '../bool';
import { dumpBigInt } from '../bigInt';
import { dumpString } from '../string';
import { dumpVector } from '../vector';
import { dumpBytes } from '../bytes';

/**
 * Dumps message object into array buffer
 * @param {{constructors: *, methods: *}} schema - schema that should be used for dumping objects
 * @param message
 * @returns {ArrayBuffer}
 */
export default function dumpBySchema(schema, message) {
  /**
   * @param {string} type
   */
  function getDumpFunction(type) {
    return R.cond([
      [R.equals('bool'), R.always(dumpBool)],
      [R.equals('Bool'), R.always(dumpBool)],
      [R.equals('int'), R.always(dumpInt)],
      [R.equals('long'), R.always(dumpBigInt)],
      [R.equals('string'), R.always(dumpString)],
      [R.equals('bytes'), R.always(dumpBytes)],
      [R.equals('!X'), R.always(R.partial(dumpBySchema, [schema]))],
      [
        isVector,
        R.pipe(
          getVectorType,
          getDumpFunction,
          R.of,
          R.partial(dumpVector),
        ),
      ],
      [isDumpingTypeFactory(schema), R.always(R.partial(dumpBySchema, [schema]))],
      [R.T, R.always(getEmptyArrayBuffer)],
    ])(type);
  }

  /**
   * Builds function to dump param
   * @param {{name: string, type: string}} param - param of message that should be dumped
   * @returns {Function}
   */
  const buildDumpAttrFunc = R.pipe(
    R.of,
    R.ap([
      R.pipe(R.prop('name'), R.prop),
      R.pipe(R.prop('type'), getDumpFunction),
    ]),
    R.apply(R.binary(R.pipe)),
  );

  const dumpId = R.pipe(R.prop('id'), dumpInt, R.always);

  /**
   * Builds function by schema
   * @param {*} objSchema
   * @returns {Function} function to dump object
   */
  function buildDumpBySchemaFunc(objSchema) {
    const buildPlainDump = R.pipe(
      R.of,
      R.ap([
        dumpId,
        R.pipe(
          R.prop('params'),
          R.map(buildDumpAttrFunc),
        ),
      ]),
      R.flatten,
      buildDumpFunc,
    );

    function dumpWithFlag(obj) {
      console.log('Dump with flag', obj);
      const buffers = [dumpId(objSchema)(obj)];
      let flagId = 0;
      const flags = (new Array(32)).fill(false);

      const params = R.prop('params', objSchema);

      for (let i = 0; i < params.length; i += 1) {
        const { name, type } = params[i];
        if (type === '#') {
          buffers.push(new ArrayBuffer());
          flagId = i;
        } else if (isFlagOption(type)) {
          if (R.has(name, obj) && R.prop(name, obj) !== undefined) {
            const match = flagOptionMatch(type);
            flags[parseInt(match[1], 10)] = true;

            const dumpType = match[2] === 'true' ? 'True' : match[2]; // dirty thing need to check

            buffers.push(getDumpFunction(dumpType)(R.prop(name, obj)));
          }
        } else {
          buffers.push(getDumpFunction(type)(R.prop(name, obj)));
        }
      }

      buffers[flagId] = dumpInt(dumpFlag(flags));
      return mergeAllArrayBuffers([
        dumpId(objSchema)(obj),
        ...buffers,
      ]);
    }

    return R.cond([
      [hasConditionalField, R.always(dumpWithFlag)],
      [R.T, buildPlainDump],
    ])(objSchema);
  }

  return R.unapply(
    R.pipe(
      R.cond([
        [
          R.pipe(R.nth(1), isMethodObject),
          R.pipe(
            R.of,
            R.ap([
              R.pipe(
                R.of,
                R.ap([R.nth(0), R.pipe(R.nth(1), R.prop(METHOD_KEY))]),
                R.apply(getSchemaForMethod),
                buildDumpBySchemaFunc,
              ),
              R.nth(1),
            ]),
            R.apply(R.call),
          ),
        ],
        [
          R.pipe(R.nth(1), isConstuctorObject),
          R.pipe(
            R.of,
            R.ap([
              R.pipe(
                R.of,
                R.ap([R.nth(0), R.pipe(R.nth(1), R.prop(CONSTRUCTOR_KEY))]),
                R.apply(getSchemaForConstructor),
                buildDumpBySchemaFunc,
              ),
              R.nth(1),
            ]),
            R.apply(R.call),
          ),
        ],
      ]),
    ),
  )(schema, message);
}
