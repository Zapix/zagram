import * as R from 'ramda';

import methodFromSchema from './methodFromSchema';
import schema from './layer5.json';
import {
  API_HASH,
  API_ID,
  METHOD_KEY,
  TYPE_KEY,
} from '../../constants';

describe('methodFromSchema', () => {
  const method = R.partial(methodFromSchema, [schema]);

  test('auth.sendCode', () => {
    expect(method(
      'auth.sendCode',
      {
        phone_number: '+79625213997',
        api_id: API_ID,
        lang_code: 'ru-ru',
        sms_type: 0,
        api_hash: API_HASH,
      },
    )).toEqual({
      [TYPE_KEY]: 'auth.SentCode',
      [METHOD_KEY]: 'auth.sendCode',
      phone_number: '+79625213997',
      lang_code: 'ru-ru',
      sms_type: 0,
      api_id: API_ID,
      api_hash: API_HASH,
    });
  });

  test('unknown', () => {
    expect(method('unknownMethod', { param1: '1', param2: '2' })).toBeUndefined();
  });
});
