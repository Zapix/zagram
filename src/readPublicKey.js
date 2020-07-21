import * as R from 'ramda';

import { uint8ToArrayBuffer } from './utils';
import { decode as decodeAsn1 } from './asn1';

const getArrayBufferFromPem = R.pipe(
  R.replace('-----BEGIN RSA PUBLIC KEY-----', ''),
  R.replace('-----END RSA PUBLIC KEY-----', ''),
  R.replace('-----BEGIN PUBLIC KEY-----', ''),
  R.replace('-----END PUBLIC KEY-----', ''),
  R.replace('\r\n', ''),
  R.replace('\n', ''),
  atob,
  R.split(''),
  R.map((x) => x.charCodeAt(0)),
  uint8ToArrayBuffer,
);

const isNeedToDecodeInnerValue = R.pipe(
  R.pathOr('', [0, 0]),
  R.equals('1.2.840.113549.1.1.1'),
);

/**
 * Reads string from pem string, that will be decoded with asn1 algorithm
 * @param {string} pemStr
 * @return {{e: bigint, n: bigint}}
 */
export default R.pipe(
  getArrayBufferFromPem,
  decodeAsn1,
  R.cond([
    [isNeedToDecodeInnerValue, R.pipe(R.nth(1), R.prop('buffer'), decodeAsn1)],
    [R.T, R.identity],
  ]),
  R.zipObj(['n', 'e']),
);
