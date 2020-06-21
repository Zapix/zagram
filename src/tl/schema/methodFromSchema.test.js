import * as R from 'ramda';

import constructorFromSchema from './constructorFromSchema';
import methodFromSchema from './methodFromSchema';
import schema from './layer108.json';
import {
  API_HASH,
  API_ID,
  CONSTRUCTOR_KEY,
  METHOD_KEY,
  TYPE_KEY,
} from '../../constants';

describe('methodFromSchema', () => {
  const construct = R.partial(constructorFromSchema, [schema]);
  const method = R.partial(methodFromSchema, [schema]);

  test('auth.sendCode', () => {
    expect(method(
      'auth.sendCode',
      {
        phone_number: '+79625213997',
        api_id: API_ID,
        api_hash: API_HASH,
        settings: construct('codeSettings', {}),
      },
    )).toMatchObject({
      [TYPE_KEY]: 'auth.SentCode',
      [METHOD_KEY]: 'auth.sendCode',
      phone_number: '+79625213997',
      api_id: API_ID,
      api_hash: API_HASH,
      settings: expect.objectContaining({
        [TYPE_KEY]: 'CodeSettings',
        [CONSTRUCTOR_KEY]: 'codeSettings',
      }),
    });
  });

  test('unknown', () => {
    expect(method('unknownMethod', { param1: '1', param2: '2' })).toBeUndefined();
  });
});
