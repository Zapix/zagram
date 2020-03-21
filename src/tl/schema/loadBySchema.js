import * as R from 'ramda';

import { loadString } from '../string';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';
import { loadBool } from '../bool';
import { loadVector } from '../vector';
import { loadBytes } from '../bytes';

import {
  flagOptionMatch,
  getParseSchemaById,
  getVectorType,
  hasConditionalField, isFlagOption,
  isVector,
  loadFlag,
} from './utils';
import { getConstructor } from '../utils';
import { buildLoadFunc, sliceBuffer, withConstantOffset } from '../../utils';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';

const getSchemaFromBufferArray = R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), getConstructor)]),
  R.apply(getParseSchemaById),
));

const bareTypeLoaders = {
  bool: loadBool,
  Bool: loadBool,
  int: loadInt,
  long: loadBigInt,
  bytes: loadBytes,
  string: loadString,
};

const isBareType = R.has(R.__, bareTypeLoaders);
const getBareTypeLoader = R.prop(R.__, bareTypeLoaders);

const getTypePair = R.pipe(
  R.of,
  R.ap([
    R.always(TYPE_KEY),
    R.pipe(
      R.prop('type'),
      R.always,
      R.partialRight(withConstantOffset, [4]),
    ),
  ]),
);

const getObjectConstructorPair = R.cond([
  [
    R.has('predicate'),
    R.pipe(
      R.of,
      R.ap([
        R.always(CONSTRUCTOR_KEY),
        R.pipe(
          R.prop('predicate'),
          R.always,
          R.partialRight(withConstantOffset, [0]),
        ),
      ]),
    ),
  ],
  [
    R.T,
    R.pipe(
      R.of,
      R.ap([
        R.always(METHOD_KEY),
        R.pipe(
          R.prop('method'),
          R.always,
          R.partialRight(withConstantOffset, [0]),
        ),
      ]),
    ),
  ],
]);


/**
 * Loads object from buffer array by schema. First of all tries to find how to parse array buffer by
 * first 4 bytes (int 32). Searches way to load it in both constructors and methods ten
 * load param by param. if param has got bare type (int, string, bool) then load them.
 * if param is complex type then load with recursive, same for vector types
 * @param {{constructors: *, methods: *}} schema
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 */
function loadBySchema(schema, buffer, withOffset) {
  function getLoaderForType(type) {
    return R.cond([
      [isBareType, getBareTypeLoader],
      [isVector, R.pipe(getVectorType, getLoaderForType, R.of, R.partial(loadVector))],
      [R.T, R.always(R.partial(loadBySchema, [schema]))],
    ])(type);
  }

  /**
   * Takes schema to build load function, returns list of pairs with name of attribute and function
   * to load it
   * @param {*} schema - how load object
   * @returns {Array<[string, Function]>}
   */
  const getLoadPairs = R.pipe(
    R.prop('params'),
    R.map(
      R.pipe(
        R.of,
        R.ap([
          R.prop('name'),
          R.pipe(
            R.prop('type'),
            getLoaderForType,
          ),
        ]),
      ),
    ),
  );

  const buildSimpleLoader = R.pipe(
    R.of,
    R.ap([getTypePair, getObjectConstructorPair, getLoadPairs]),
    (x) => [x[0], x[1], ...x[2]],
    buildLoadFunc,
  );

  /**
   * Loads with flag
   * TODO: write in functional style
   * @param {*} objSchema object to load array buffer
   * @param {ArrayBuffer} objBuffer array buffer that should be loaded
   * @param {boolean} withObjOffset - offset
   * @returns {{}}
   */
  function loadWithFlag(objSchema, objBuffer, withObjOffset) {
    let value = {};
    let flags;
    let currentBuffer;
    let commonOffset = 0;

    const { value: typeData, offset: baseOffset } = buildLoadFunc([
      getTypePair(objSchema),
      getObjectConstructorPair(objSchema),
    ])(objBuffer, true);

    commonOffset += baseOffset;
    value = { ...value, ...typeData };

    currentBuffer = sliceBuffer(objBuffer, commonOffset);
    const params = R.prop('params', objSchema);

    for (let i = 0; i < params.length; i += 1) {
      const { name, type } = params[i];
      if (type === '#') {
        const { value: flagInt, offset: currentOffset } = loadInt(currentBuffer, true);
        commonOffset += currentOffset;
        flags = loadFlag(flagInt);
        currentBuffer = sliceBuffer(currentBuffer, currentOffset);
      } else if (isFlagOption(type)) {
        const data = flagOptionMatch(type);
        const flagId = parseInt(data[1], 10);
        const currentType = data[2];

        if (currentType === 'true') {
          value = { ...value, [name]: flags[flagId] };
        } else if (flags[flagId]) {
          const loader = getLoaderForType(currentType);
          const { value: param, offset: currentOffset } = loader(currentBuffer, true);
          value = { ...value, [name]: param };
          commonOffset += currentOffset;
          currentBuffer = sliceBuffer(currentBuffer, currentOffset);
        }
      } else {
        const loader = getLoaderForType(type);
        const { value: param, offset: currentOffset } = loader(currentBuffer, true);
        value = { ...value, [name]: param };
        commonOffset += currentOffset;
        currentBuffer = sliceBuffer(currentBuffer, currentOffset);
      }
    }

    return withObjOffset ? { value, offset: commonOffset } : value;
  }

  const getLoadFuncs = R.pipe(
    R.partial(getSchemaFromBufferArray, [schema]),
    R.cond([
      [hasConditionalField, R.pipe(R.of, R.partial(loadWithFlag))],
      [R.T, buildSimpleLoader],
    ]),
  );

  return getLoadFuncs(buffer)(buffer, withOffset);
}

export default loadBySchema;
