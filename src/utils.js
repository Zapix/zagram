import * as R from 'ramda';
import random from 'random-bigint';
import forge from 'node-forge';

import { DC_ID, PROTOCOL_ID, TEST_DC_INC } from './constants';

export const debug = (x) => {
  console.log(x);
  return x;
};

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const getRandomByte = R.partial(getRandomInt, [256]);

export const getNRandomBytes = R.times(getRandomByte);

const checkFirstByte = R.pipe(
  (buffer) => (new Uint8Array(buffer, 0, 1))[0],
  R.equals(0xef),
  R.not,
);

const checkFirstInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 0, 4))[0],
  R.anyPass([
    R.equals(0x44414548),
    R.equals(0x54534f50),
    R.equals(0x20544547),
    R.equals(0x4954504f),
    R.equals(0xdddddddd),
    R.equals(0xeeeeeeee),
  ]),
  R.not,
);

const checkSecondInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 4, 4))[0],
  R.equals(0x00000000),
  R.not,
);

/**
 * Copy bytes from Uint8Array `from` to Uint*Array `to`;
 * @param {Uint8Array|Number[]} fromArr
 * @param {Uint8Array} toArr
 */
export function copyBytes(fromArr, toArr) {
  for (let i = 0; i < fromArr.length; i += 1) {
    toArr[i] = fromArr[i];
  }
}

/**
 * Takes ArrayBuffer init payload and return is it valid or not
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
export const isValidInitPayload = R.allPass([
  checkFirstByte,
  checkFirstInt,
  checkSecondInt,
]);

/**
 * Generates init payload for websocket communication. Please check:
 * https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
 * @returns {ArrayBuffer}
 */
export function generateFirstInitPayload() {
  const buffer = new ArrayBuffer(64);
  const prefix = new Uint8Array(buffer, 0, 56);
  const protocol = new Uint32Array(buffer, 56, 1);
  const dc = new Int16Array(buffer, 60, 1);
  const postfix = new Uint8Array(buffer, 62, 2);

  while (!isValidInitPayload(buffer)) {
    for (let i = 0; i < prefix.length; i += 1) {
      prefix[i] = getRandomInt(256);
    }
    protocol[0] = PROTOCOL_ID;
    dc[0] = DC_ID + TEST_DC_INC;
    for (let i = 0; i < postfix.length; i += 1) {
      postfix[i] = getRandomInt(256);
    }
  }

  return buffer;
}

/**
 * Builds second init payload by reversing first init payload
 * @param {ArrayBuffer} initPayloadBuffer
 * @returns {ArrayBuffer}
 */
export function buildSecondInitPayload(initPayloadBuffer) {
  const buffer = new ArrayBuffer(initPayloadBuffer.byteLength);

  const firstView = new Uint8Array(initPayloadBuffer);
  const secondView = new Uint8Array(buffer);

  for (let i = 0; i < secondView.length; i += 1) {
    secondView[secondView.length - i - 1] = firstView[i];
  }

  return buffer;
}

/**
 * Builds Uint8 Array from string
 * @param {string} str - string that should be encoded;
 * @returns {Uint8Array}
 */
export function stringToUint8(str) {
  const encoder = new TextEncoder('utf8');
  return encoder.encode(str);
}

/**
 * Builds string form Uint8Array
 * @param {Uint8Array} uint8arr
 * @returns {string}
 */
export function uint8ToString(uint8arr) {
  const decoder = new TextDecoder('utf8');
  return decoder.decode(uint8arr);
}

/**
 * Translate value to array of bytes in little-endian order
 * @param {Number} value
 * @returns {Number[]}
 */
export function toLittleEndian(value) {
  const result = [];

  let current = value;

  while (current > 0) {
    result.push(current % 256);
    current = Math.floor(current / 256);
  }
  return result;
}

/**
 * Returns true if passed value is a prime value
 * @param {BigInt} p
 * @returns {boolean}
 */
export function isPrime(p) {
  for (let i = BigInt(2); i * i <= p; i += BigInt(1)) {
    if (p % i === BigInt(0)) return false;
  }
  return true;
}

export function* primeGenerator() {
  yield BigInt(2);
  const primeResults = [BigInt(2)];

  let i = BigInt(2);
  while (true) {
    let prime = true;
    for (let j = 0; j < primeResults.length; j += 1) {
      if (i % primeResults[j] === BigInt(0)) {
        prime = false;
        break;
      }
    }
    if (prime) {
      primeResults.push(i);
      yield i;
    }
    i += BigInt(1);
  }
}

function absDec(a, b) {
  if (a > b) {
    return a - b;
  }
  return b - a;
}

function gcd(a, b) {
  while (b) {
    const tmp = a;
    a = b;
    b = tmp % b;
  }

  return a;
}

function min(a, b) {
  if (a < b) {
    return a;
  }
  return b;
}


/**
 * Fast modular exponentiation for a ^ b mod n
 * @returns {BigInt}
 */
export function powModulo(a, b, n) {
  a %= n;
  let result = BigInt(1);
  let x = a;

  while (b > 0) {
    const leastSignificantBit = b % BigInt(2);
    b /= BigInt(2);

    if (leastSignificantBit === BigInt(1)) {
      result *= x;
      result %= n;
    }

    x *= x;
    x %= n;
  }
  return result;
}

/**
 * Decompose prime factors takes algorithm form
 * https://github.com/LonamiWebs/Telethon/blob/master/telethon/crypto/factorization.py
 * @param {BigInt} pq - factorized number
 * @returns {BigInt[]} - list of p q factors where p < q
 */
export function findPrimeFactors(pq) {
  if (pq % BigInt(2) === BigInt(0)) {
    return [2, pq / BigInt(2)];
  }

  let y = BigInt(1) + (random(64) % (pq - BigInt(1)));
  const c = BigInt(1) + (random(64) % (pq - BigInt(1)));
  const m = BigInt(1) + (random(64) % (pq - BigInt(1)));

  let g = BigInt(1);
  let r = BigInt(1);
  let q = BigInt(1);

  let x = BigInt(0);
  let ys = BigInt(0);

  while (g === BigInt(1)) {
    x = y;
    for (let i = BigInt(0); i < r; i += BigInt(1)) {
      y = (((y ** BigInt(2)) % pq) + c) % pq;
    }

    let k = BigInt(0);
    while (k < r && g === BigInt(1)) {
      ys = y;
      for (let i = BigInt(0); i < min(m, r - k); i += BigInt(1)) {
        y = (((y ** BigInt(2)) % pq) + c) % pq;
        q = (q * absDec(x, y)) % pq;
      }
      g = gcd(q, pq);
      k += m;
    }

    r *= BigInt(2);
  }

  if (g === pq) {
    /* eslint-disable-next-line */
    while (true) { // eslint: noqa
      ys = (((ys ** BigInt(2)) % pq) + c) % pq;
      g = gcd(absDec(x, ys), pq);
      if (g > 1) {
        break;
      }
    }
  }

  const p = g;
  q = pq / p;
  console.log(`PQ: ${pq.toString(16)}`);
  console.log(`P: ${p.toString(16)}`);
  console.log(`Q: ${q.toString(16)}`);
  console.log(`P * Q: ${(p * q).toString(16)}`);
  return (p < q) ? [p, q] : [q, p];
}

/**
 * @param {Number} x
 * @returns {string}
 */
export function numberToHex(x) {
  return x.toString(16);
}

/**
 * Return hex variant of uint8array
 * @param {Uint8Array|Number[]} arr
 * @returns {string} - hex string
 */
export function uint8ArrayToHex(arr) {
  let hex = '';
  for (let i = 0; i < arr.length; i += 1) {
    hex += arr[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Parases hex string to number array of bytes
 * @param {string} - hex string,
 * @return {Number[]}
 */
export const hexToUint8Array = R.pipe(
  R.cond([
    [R.startsWith('0x'), R.slice(2, Infinity)],
    [R.T, R.identity],
  ]),
  R.splitEvery(2),
  R.map(R.flip(R.curryN(2)(parseInt))(16)),
);

/**
 * Parses hex string and returns ArrayBuffer of it
 * @param hexStr
 * @return {ArrayBuffer}
 */
export function hexToArrayBuffer(hexStr) {
  const bytesArr = hexToUint8Array(hexStr);
  const buffer = new ArrayBuffer(bytesArr.length);
  const bufferBytes = new Uint8Array(buffer);

  copyBytes(bytesArr, bufferBytes);
  return buffer;
}

/**
 * Parse sequence of bytes to BigInt. Sequence has got big endian format as default
 * @param {Uint8Array|Number[]} arr
 * @param {boolean} [littleEndian]
 * @returns {BigInt}
 */
export function uint8ToBigInt(arr, littleEndian) {
  const calc = littleEndian ? arr.reverse() : arr;
  const hex = uint8ArrayToHex(calc);
  return BigInt(`0x${hex}`);
}


/**
 * Moves all arr into buffer
 * @param {Uint8Array} arr
 * @returns {ArrayBuffer}
 */
export function uint8ToArrayBuffer(arr) {
  const buffer = new ArrayBuffer(arr.length);
  const bufferBytes = new Uint8Array(buffer);
  copyBytes(arr, bufferBytes);
  return buffer;
}
/**
 * Trans number or bigint to Uint8Array with big endian format if little endian doesn't set
 * @param bigint
 * @param littleEndian
 * @returns {number[]}
 */
export function bigIntToUint8Array(bigint, littleEndian) {
  const result = [];
  let value = BigInt(bigint);

  while (value > BigInt(0)) {
    result.push(Number(value % BigInt(256)));
    value /= BigInt(256);
  }
  if (result.length === 0) {
    result.push(0);
  }
  return littleEndian ? result : result.reverse();
}

/**
 * Converts ByteBuffer to ArrayBuffer
 * @param {ByteBuffer} forgeBuffer
 * @returns {ArrayBuffer}
 */
export function forgeBufferToArrayBuffer(forgeBuffer) {
  const bufferHex = forgeBuffer.toHex();
  const bufferArray = hexToUint8Array(bufferHex);

  const buffer = new ArrayBuffer(bufferArray.length);
  const uintArray = new Uint8Array(buffer);
  for (let i = 0; i < uintArray.length; i += 1) uintArray[i] = bufferArray[i];
  return buffer;
}

/**
 * Converts ArrayBuffer to node-forge ByteBuffer;
 * @param arrayBuffer
 * @returns {ByteBuffer}
 */
export function arrayBufferToForgeBuffer(arrayBuffer) {
  const forgeBuffer = forge.util.createBuffer();
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < uintArray.length; i += 1) forgeBuffer.putByte(uintArray[i]);
  return forgeBuffer;
}


/**
 * @returns {number}
 */
export function getUnixTimestamp() {
  return Math.floor(+Date.now() / 1000);
}

/**
 * Generates message id
 * @returns {bigint}
 */
export function getMessageId() {
  if (!getMessageId.inc) {
    getMessageId.inc = 1;
  } else {
    getMessageId.inc += 1;
  }
  return BigInt(getUnixTimestamp() * 2 ** 32) + BigInt(getMessageId.inc * 4);
}

/**
 * Copies whole buffer to another with recipient buffer offset
 * @param fromBuffer
 * @param toBuffer
 * @param offset
 */
export function copyBuffer(fromBuffer, toBuffer, offset = 0) {
  const fromBufferBytes = new Uint8Array(fromBuffer);
  const toBufferBytes = new Uint8Array(toBuffer, offset);
  copyBytes(fromBufferBytes, toBufferBytes);
}


/**
 * Takes buffers on nonce and builds sha1 has of them
 * @param {forge.util.ByteBuffer} aNonce
 * @param {forge.utils.ByteBuffer} bNonce
 * @returns {Object} - hash digest
 */
function hashFromNonces(aNonce, bNonce) {
  const md = forge.md.sha1.create();
  md.update(aNonce.data + bNonce.data);
  return md.digest();
}

/**
 * Generates key, iv values for AES encryption
 *
 * answer_with_hash := SHA1(answer) + answer + (0-15 random bytes); such that the length
 * be divisible by 16;
 * tmp_aes_key := SHA1(new_nonce + server_nonce) + substr (SHA1(server_nonce + new_nonce), 0, 12);
 * tmp_aes_iv := substr (SHA1(server_nonce + new_nonce), 12, 8) + SHA1(new_nonce + new_nonce) +
 * substr (new_nonce, 0, 4);
 *
 * @param {Uint8Array|Number[]} serverNonce
 * @param {Uint8Array|Number[]} newNonce
 * @returns {{iv: forge.util.ByteBuffer, key: forge.util.ByteBuffer}} - byte strings of data
 */
export function generateKeyDataFromNonce(serverNonce, newNonce) {
  const serverNonceBuffer = forge.util.createBuffer();
  R.forEach((x) => serverNonceBuffer.putByte(x), serverNonce);
  const newNonceBuffer = forge.util.createBuffer();
  R.forEach((x) => newNonceBuffer.putByte(x), newNonce);

  const newNonceServerNonceHash = hashFromNonces(newNonceBuffer, serverNonceBuffer);
  const serverNonceNewNonceHash = hashFromNonces(serverNonceBuffer, newNonceBuffer);
  const newNonceNewNonceHash = hashFromNonces(newNonceBuffer, newNonceBuffer);

  const keyBytes = (
    newNonceServerNonceHash.data
    + serverNonceNewNonceHash.data.slice(0, 12)
  );

  const ivBytes = (
    serverNonceNewNonceHash.data.slice(12)
    + newNonceNewNonceHash.data
    + newNonceBuffer.data.slice(0, 4)
  );

  return {
    key: forge.util.createBuffer(keyBytes),
    iv: forge.util.createBuffer(ivBytes),
  };
}

export const uint8toForgeBuffer = R.pipe(
  uint8ToArrayBuffer,
  arrayBufferToForgeBuffer,
);

export const arrayBufferToUint8Array = (x) => new Uint8Array(x);

export const dumpArrayBuffer = R.pipe(
  arrayBufferToUint8Array,
  uint8ArrayToHex,
);

export const arrayBufferToHex = dumpArrayBuffer;

/**
 * @param {ArrayBuffer} bufferA
 * @param {ArrayBuffer} bufferB
 * @returns {ArrayBuffer}
 */
export function mergeArrayBuffer(bufferA, bufferB) {
  const buffer = new ArrayBuffer(bufferA.byteLength + bufferB.byteLength);
  const bufferAView = new Uint8Array(bufferA);
  const bufferBView = new Uint8Array(bufferB);

  const bufferPart1 = new Uint8Array(buffer, 0, bufferA.byteLength);
  const bufferPart2 = new Uint8Array(buffer, bufferA.byteLength, bufferB.byteLength);

  copyBytes(bufferAView, bufferPart1);
  copyBytes(bufferBView, bufferPart2);

  return buffer;
}

/**
 * @param {ArrayBuffer} buffer
 * @param {Number} start
 * @param {Number} [end]
 * @returns {ArrayBuffer}
 */
export function sliceBuffer(buffer, start, end) {
  return buffer.slice(start, end);
}

export const getEmptyArrayBuffer = R.always(new ArrayBuffer(0));

export const mergeAllArrayBuffers = R.reduce(mergeArrayBuffer, getEmptyArrayBuffer());

/**
 * @param {Array<Function>} dumpFuncs
 * @returns {ArrayBuffer}
 */
export const buildDumpFunc = R.pipe(
  R.ap,
  R.partial(R.binary(R.pipe), [R.of]),
  R.partialRight(R.binary(R.pipe), [mergeAllArrayBuffers]),
);

export const isWithOffset = R.pipe(
  R.nthArg(1),
  R.equals(true),
);

export const withConstantOffset = (func, offset) => (x) => ({
  value: func(x),
  offset,
});
/**
 * Computes offset of whole message
 * @param {Array<{ offset: Number }>} - list of loaded data
 * @returns {Number} - offset of whole message
 */
export const computeOffset = R.pipe(
  R.ap([R.prop('offset')]),
  R.sum,
);

/**
 * loads data from pairs with array buffer
 * @param {{ value: *, offset: Number }} result
 * @param {Number} idx
 * @param {Array<[string, Function]>} pairs
 * @param {ArrayBuffer} buffer
 */
function loadByPairs(result, idx, pairs, buffer) {
  const [attrName, loader] = pairs[idx];
  const { offset, value } = result;
  const slicedBuffer = sliceBuffer(buffer, offset, undefined);
  const { value: loadedValue, offset: loadedOffset } = loader(slicedBuffer, true);
  const updatedResult = {
    value: {
      [attrName]: loadedValue,
      ...value,
    },
    offset: offset + loadedOffset,
  };

  const nIdx = idx + 1;
  return (pairs.length === nIdx) ? updatedResult : loadByPairs(updatedResult, nIdx, pairs, buffer);
}

/**
 * Build function to load data for object from ArrayBuffer
 * @param {Array<[string, Function]>} pairs - tuple where first argument is a name of attribute,
 * second argument is a function to load data
 */
export function buildLoadFunc(pairs) {
  const load = R.partial(loadByPairs, [{ value: {}, offset: 0 }, 0, pairs]);
  return R.cond([
    [isWithOffset, R.pipe(R.nthArg(0), load)],
    [R.T, R.pipe(R.nthArg(0), load, R.prop('value'))],
  ]);
}

export const buildTypeLoader = R.pipe(
  R.of,
  R.ap([R.identity, R.always(4)]),
  R.zipObj(['value', 'offset']),
  R.always,
);
