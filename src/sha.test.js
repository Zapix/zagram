import * as R from 'ramda';
import { sha1, sha256 } from './sha';
import { arrayBufferToHex, uint8ToArrayBuffer } from './utils';


describe('sha', () => {
  const message = 'hello';
  const messageBytes = R.map(
    (x) => x.charCodeAt(0),
    message,
  );
  const messageBuffer = uint8ToArrayBuffer(messageBytes);

  test('sha1', () => {
    expect(
      arrayBufferToHex(sha1(messageBuffer)),
    ).toEqual(
      'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    );
  });

  test('sha256', () => {
    expect(
      arrayBufferToHex(sha256(messageBuffer)),
    ).toEqual(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });
});
