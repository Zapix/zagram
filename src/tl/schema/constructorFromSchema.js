import * as R from 'ramda';

import { getSchemaForConstructor } from './utils';
import { CONSTRUCTOR_KEY, TYPE_KEY } from '../../constants';


const buildGetTypePairFunc = R.pipe(
  R.prop('type'),
  R.of,
  R.ap([
    R.always(TYPE_KEY),
    R.identity,
  ]),
  R.always,
);

const buildGetPredicatePairFunc = R.pipe(
  R.prop('predicate'),
  R.of,
  R.ap([
    R.always(CONSTRUCTOR_KEY),
    R.identity,
  ]),
  R.always,
);


/**
 * Builds object that could be dumped as method call
 * @param {{constructors: *, methods: *}} schema
 * @param {string} predicate
 * @param {*} params
 */
export default R.unapply(R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.of,
      R.ap([
        R.nth(0),
        R.nth(1),
      ]),
      R.apply(getSchemaForConstructor),
      R.cond([
        [
          Boolean,
          R.pipe(
            R.of,
            R.ap([
              buildGetTypePairFunc,
              buildGetPredicatePairFunc,
              R.pipe(
                R.prop('params'),
                R.map(R.pipe(
                  R.prop('name'),
                  R.of,
                  R.ap([
                    R.always,
                    R.prop,
                  ]),
                  R.ap,
                  (func) => R.pipe(R.of, func),
                )),
              ),
            ]),
            R.flatten,
            R.ap,
            (func) => R.pipe(R.of, func, R.fromPairs),
          ),
        ],
        [R.T, R.always],
      ]),
    ),
    R.pipe(R.nth(2)),
  ]),
  R.apply(R.call),
));
