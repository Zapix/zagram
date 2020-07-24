import * as R from 'ramda';

import {
  TYPE_KEY,
  RES_PQ_TYPE,
  METHOD_KEY,
  REQ_PQ_METHOD,
  PQ_INNER_DATA_TYPE,
  CONSTRUCTOR_KEY,
  PQ_INNER_DATA_CONSTRUCTOR,
  SERVER_DH_PARAMS_TYPE,
  REQ_DH_PARAMS_METHOD,
  CLIENT_DH_INNER_DATA_TYPE,
  CLIENT_DH_INNER_DATA_CONSTRUCTOR,
  SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
  SET_CLIENT_DH_PARAMS_METHOD,
  DH_GEN_FAIL_CONSTRUCTOR,
  DH_GEN_RETRY_CONSTRUCTOR,
  DH_GEN_OK_CONSTRUCTOR, SERVER_DH_PARAMS_FAIL_CONSTRUCTOR,
} from './constants';
import {
  bigIntToUint8Array,
  findPrimeFactors,
  uint8ToBigInt,
  copyBytes,
  getNRandomBytes,
  powModulo,
  uint8ToArrayBuffer,
  uint8ArrayToHex,
  arrayBufferToUint8Array,
  mergeAllArrayBuffers,
  sliceBuffer,
  arrayBufferToHex,
} from './utils';
import { getPublicKey } from './pems';
import {
  decryptIge as decryptAesIge,
  encryptIge as encryptAesIge,
  generateKeyDataFromNonce,
} from './aes';
import { sha1 } from './sha';
import rsaEncrypt from './rsa';
import { dumpPQInnerData } from './tl/p_q_inner_data';
import { isMessageOf } from './tl/utils';
import { loadServerDHInnerData } from './tl/server_DH_inner_data';
import { dumpClientDHInnerData } from './tl/client_DH_inner_data';

function getRandomNonce(bytes = 16) {
  return uint8ToBigInt(getNRandomBytes(bytes));
}

/**
 * Generates message for p q authorization
 * @returns {Object}
 */
export function getInitialDHExchangeMessage() {
  return {
    [TYPE_KEY]: RES_PQ_TYPE,
    [METHOD_KEY]: REQ_PQ_METHOD,
    nonce: getRandomNonce(),
  };
}

/* eslint-disable */
/**
 * Parse response PQ from schema:
 * resPQ#05162463 nonce:int128 server_nonce:int128 pq:string server_public_key_fingerprints:Vector long = ResPQ;
 * @param {ArrayBuffer} resPQ - buffer with server pq response
 * @returns {Object} - resPQ with with response
 */
/* eslint-enable */
export function parseResponsePQ(resPQ) {
  const constructor = new Uint32Array(resPQ, 0, 1);
  const nonce = new Uint8Array(resPQ, 4, 16);
  const serverNonce = new Uint8Array(resPQ, 20, 16);
  const pq = new Uint8Array(resPQ, 37, 8);
  const vectorLong = new Uint8Array(resPQ, 48, 4);
  const count = new Uint32Array(resPQ, 52, 1);
  const fingerprint = new Uint8Array(resPQ, 56, 8);
  const fingerprintBuffer = resPQ.slice(56, 64);

  return {
    constructor,
    nonce,
    server_nonce: serverNonce,
    pq,
    vector_long: vectorLong,
    count,
    fingerprint,
    fingerprint_buffer: fingerprintBuffer,
    buffer: resPQ,
  };
}

/**
 * Checks that nonce of init message and response are equal
 * @param {Object} aMessage
 * @param {Object} bMessage
 * @param {string} nonceField - nonce field name
 */
export function areNonceEqual(aMessage, bMessage, nonceField) {
  if (!nonceField) {
    nonceField = 'nonce';
  }

  const aNonce = R.prop(nonceField, aMessage);
  const bNonce = R.prop(nonceField, bMessage);
  for (let i = 0; i < aNonce.length; i += 1) {
    if (aNonce[i] !== bNonce[i]) {
      return false;
    }
  }
  return true;
}

export function buildPQInnerData(responsePQ) {
  const pqValue = uint8ToBigInt(responsePQ.pq);
  const [pValue, qValue] = findPrimeFactors(pqValue);
  const p = bigIntToUint8Array(pValue);
  const q = bigIntToUint8Array(qValue);

  const newNonce = getRandomNonce(32);

  const data = {
    [TYPE_KEY]: PQ_INNER_DATA_TYPE,
    [CONSTRUCTOR_KEY]: PQ_INNER_DATA_CONSTRUCTOR,
    p,
    q,
    pq: responsePQ.pq,
    nonce: responsePQ.nonce,
    server_nonce: responsePQ.server_nonce,
    new_nonce: newNonce,
  };

  return data;
}

export function encryptPQInner(responsePQ, pqInnerData) {
  const pqInnerBuffer = dumpPQInnerData(pqInnerData);
  const hash = sha1(pqInnerBuffer);
  const randomBytesCount = 255 - (hash.byteLength + pqInnerBuffer.byteLength);
  const randomBytes = R.pipe(
    R.curry(getNRandomBytes),
    uint8ToArrayBuffer,
  )(randomBytesCount);

  const fingerprint = responsePQ.fingerprints[0];
  const pubKey = getPublicKey(fingerprint);

  const originBuffer = mergeAllArrayBuffers([hash, pqInnerBuffer, randomBytes]);
  const encryptedBuffer = rsaEncrypt(originBuffer, pubKey);
  return arrayBufferToUint8Array(encryptedBuffer);
}


/**
 *
 * @param {Object} responsePQ - object with response pq data
 * @param {Object} innerPQ - object with inner pq data
 * @param {Uint8Array} encryptedInnerPQ- object with encrypted inner pq data
 */
export function buildDHExchangeMessage(responsePQ, innerPQ, encryptedInnerPQ) {
  return {
    [TYPE_KEY]: SERVER_DH_PARAMS_TYPE,
    [METHOD_KEY]: REQ_DH_PARAMS_METHOD,
    nonce: responsePQ.nonce,
    server_nonce: responsePQ.server_nonce,
    p: innerPQ.p,
    q: innerPQ.q,
    fingerprint: responsePQ.fingerprints[0],
    encrypted_data: encryptedInnerPQ,
  };
}

/**
 * Decryptes inner data of dh params and build object for them
 * @param encryptedDHParams
 * @param pqInnerData
 * @returns {{}}
 */
export function decryptDHParams(encryptedDHParams, pqInnerData) {
  const { key, iv } = generateKeyDataFromNonce(
    bigIntToUint8Array(encryptedDHParams.server_nonce, true),
    bigIntToUint8Array(pqInnerData.new_nonce, true),
  );

  const answerBuffer = decryptAesIge(
    uint8ToArrayBuffer(encryptedDHParams.encrypted_answer),
    uint8ToArrayBuffer(key),
    uint8ToArrayBuffer(iv),
  );
  const answerWithoutHash = sliceBuffer(answerBuffer, 20);

  return {
    key,
    iv,
    ...loadServerDHInnerData(answerWithoutHash),
  };
}

/**
 * Takes decrypted dhParams and builds gab, ga values
 * @param dhParams
 */
export function dhComputation(dhParams) {
  const b = uint8ToBigInt(getNRandomBytes(256));

  const ga = uint8ToBigInt(dhParams.g_a);
  const g = BigInt(dhParams.g);
  const dhPrime = uint8ToBigInt(dhParams.dh_prime);

  const gb = powModulo(g, b, dhPrime);
  const gab = powModulo(ga, b, dhPrime);

  return {
    b, g, ga, gb, gab,
  };
}

/**
 * Builds inner message for client DH data
 * @param {Object} encryptedDHParams - encrypted values of server dh
 * @param {Object} dhValues - computed dhValues
 * @returns {ArrayBuffer}
 */
export function buildDHInnerMessage(encryptedDHParams, dhValues) {
  return {
    [TYPE_KEY]: CLIENT_DH_INNER_DATA_TYPE,
    [CONSTRUCTOR_KEY]: CLIENT_DH_INNER_DATA_CONSTRUCTOR,
    nonce: encryptedDHParams.nonce,
    server_nonce: encryptedDHParams.server_nonce,
    retry_id: BigInt('0'),
    g_b: bigIntToUint8Array(dhValues.gb),
  };
}

/**
 * Encrypts messsage with key and iv values
 * @param {Object} dhInnerMessage
 * @param {forge.util.ByteBuffer} key
 * @param {forge.util.ByteBuffer} iv
 * @returns {ArrayBuffer}
 */
export function encryptInnerMessage(dhInnerMessage, key, iv) {
  const dhInnerMessageBuffer = dumpClientDHInnerData(dhInnerMessage);
  const innerHash = sha1(dhInnerMessageBuffer);
  const innerHashBytes = arrayBufferToUint8Array(innerHash);
  const dataWithHashLength = innerHashBytes.length + dhInnerMessageBuffer.byteLength;
  const randomDataLength = (16 - (dataWithHashLength % 16)) % 16;

  const dataWithHashBuffer = new ArrayBuffer(dataWithHashLength + randomDataLength);
  const hashBytes = new Uint8Array(dataWithHashBuffer, 0, innerHashBytes.length);
  copyBytes(innerHashBytes, hashBytes);

  const dhInnerMessageBytes = new Uint8Array(dhInnerMessageBuffer);
  const messageBytes = new Uint8Array(
    dataWithHashBuffer,
    innerHashBytes.length,
    dhInnerMessageBytes.length,
  );
  copyBytes(dhInnerMessageBytes, messageBytes);

  const randomBytes = getNRandomBytes(randomDataLength);
  const randomMessageBytes = new Uint8Array(dataWithHashBuffer, dataWithHashLength);
  copyBytes(randomBytes, randomMessageBytes);

  const encryptedMessage = encryptAesIge(
    dataWithHashBuffer,
    uint8ToArrayBuffer(key),
    uint8ToArrayBuffer(iv),
  );
  return encryptedMessage;
}

export function buildSetClientDhParamsMessage(encodedMessage, dhParams) {
  return {
    [TYPE_KEY]: SET_CLIENT_DH_PARAMS_ANSWER_TYPE,
    [METHOD_KEY]: SET_CLIENT_DH_PARAMS_METHOD,
    nonce: dhParams.nonce,
    server_nonce: dhParams.server_nonce,
    encrypted_data: arrayBufferToUint8Array(encodedMessage),
  };
}


export function checkDHVerifyResponse(verifyResponse) {
  if (isMessageOf(DH_GEN_FAIL_CONSTRUCTOR, verifyResponse)) {
    const errorMessage = 'DH generation failed';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (isMessageOf(DH_GEN_RETRY_CONSTRUCTOR, verifyResponse)) {
    const errorMessage = 'DH generation need to be retried';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!isMessageOf(DH_GEN_OK_CONSTRUCTOR, verifyResponse)) {
    const errorMessage = 'Unexpected DH generation error';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

function buildAuthKeyHash(authKey) {
  const authKeyBuffer = new ArrayBuffer(authKey.length);
  const authKeyBufferBytes = new Uint8Array(authKeyBuffer);
  copyBytes(authKey, authKeyBufferBytes);
  return R.pipe(
    sha1,
    arrayBufferToUint8Array,
  )(authKeyBuffer);
}

const buildAuthKeyId = R.slice(12, 20);
const buildAuthKeyAuxHash = R.slice(0, 8);

function verifyNewNonce(newNonce, authKeyAuxHash, verifyResponse) {
  const nonceNumberWithAuxHash = R.flatten([
    bigIntToUint8Array(newNonce, true),
    [1],
    authKeyAuxHash,
  ]);

  const buffer = uint8ToArrayBuffer(nonceNumberWithAuxHash);
  const result = R.pipe(
    sha1,
    R.partialRight(sliceBuffer, [4]),
    arrayBufferToHex,
  )(buffer);

  const newNonceHash1Str = R.pipe(
    R.prop('new_nonce_hash1'),
    R.partialRight(bigIntToUint8Array, [true]),
    uint8ArrayToHex,
  )(verifyResponse);

  if (result !== newNonceHash1Str) {
    const message = 'Verify new nonce issue';
    console.error(message);
    throw new Error(message);
  }
}

function buildSalt({ server_nonce: serverNonce, new_nonce: newNonce }) {
  const serverNonceUint = bigIntToUint8Array(serverNonce, true);
  const newNonceUint = bigIntToUint8Array(newNonce, true);
  const salt = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    /* eslint-disable */
    salt[i] = newNonceUint[i] ^ serverNonceUint[i];
    /* eslint-enable */
  }
  return salt;
}

export default function createAuthorizationKey(sendRequest) {
  const initDHMessage = getInitialDHExchangeMessage();

  return Promise.race([
    sendRequest(initDHMessage)
      .then((responsePQ) => {
        if (initDHMessage.nonce !== responsePQ.nonce) {
          throw Error('Nonce are not equal');
        }

        const pqInnerData = buildPQInnerData(responsePQ);
        const encryptedData = encryptPQInner(responsePQ, pqInnerData);
        const exchangeMessage = buildDHExchangeMessage(responsePQ, pqInnerData, encryptedData);

        return Promise.all([
          sendRequest(exchangeMessage),
          Promise.resolve(pqInnerData),
        ]);
      })
      .then(([serverDHParams, pqInnerData]) => {
        if (
          serverDHParams.nonce !== pqInnerData.nonce
          || serverDHParams.server_nonce !== pqInnerData.server_nonce
        ) {
          throw Error('Nonce are not equal');
        }

        if (isMessageOf(SERVER_DH_PARAMS_FAIL_CONSTRUCTOR, serverDHParams)) {
          throw Error('Server dh params fail');
        }

        const dhParams = decryptDHParams(serverDHParams, pqInnerData);
        const dhValues = dhComputation(dhParams);
        const dhInnerMessage = buildDHInnerMessage(dhParams, dhValues);
        const encryptedMessage = encryptInnerMessage(dhInnerMessage, dhParams.key, dhParams.iv);
        const setClientDHParamsMessage = buildSetClientDhParamsMessage(encryptedMessage, dhParams);
        return Promise.all([
          sendRequest(setClientDHParamsMessage),
          Promise.resolve(dhValues),
          Promise.resolve(pqInnerData),
        ]);
      })
      .then(([verifyResponse, dhValues, pqInnerData]) => {
        checkDHVerifyResponse(verifyResponse);
        const serverSalt = buildSalt(pqInnerData);
        const authKey = bigIntToUint8Array(dhValues.gab);
        const authKeyHash = buildAuthKeyHash(authKey);
        const authKeyId = buildAuthKeyId(authKeyHash);
        const authKeyAuxHash = buildAuthKeyAuxHash(authKeyHash);

        verifyNewNonce(pqInnerData.new_nonce, authKeyAuxHash, verifyResponse);
        return { authKey, authKeyId, serverSalt };
      }),
    new Promise((resolve, reject) => setTimeout(reject, 600 * 100))
      .then(() => {
        console.error('request is too long');
      }),
  ]);
}
