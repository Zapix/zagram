import * as R from 'ramda';

import constructorFromSchema from './constructorFromSchema';
import schema from './layer5.json';
import { CONSTRUCTOR_KEY, TYPE_KEY } from '../../constants';

describe('constructorFromSchema', () => {
  const construct = R.partial(constructorFromSchema, [schema]);

  test('inputPhoto', () => {
    expect(construct(
      'inputPhoto',
      { id: 123123, access_hash: 12 },
    )).toEqual({
      [TYPE_KEY]: 'InputPhoto',
      [CONSTRUCTOR_KEY]: 'inputPhoto',
      id: 123123,
      access_hash: 12,
    });
  });

  test('undefined', () => {
    expect(construct('undefined', {})).toBeUndefined();
  });
});
