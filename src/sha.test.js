import * as R from 'ramda';
import { sha256 } from './sha';
import { uint8ToArrayBuffer } from './utils';


describe('sha256', () => {
  test('sha256', () => {
    const message = 'hello';
    const messageBytes = R.map(
      (x) => x.charCodeAt(0),
      message,
    );
    const messageBuffer = uint8ToArrayBuffer(messageBytes);
    expect(
      sha256(messageBuffer).toHex(),
    ).toEqual(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });
});
