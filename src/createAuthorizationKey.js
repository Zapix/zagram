import * as R from 'ramda';
import forge from 'node-forge';

import {
  PQ_INNER_DATA,
  REQ_PQ,
  REQ_DH_PARAMS,
  SERVER_DH_PARAMS_FAIL,
  SERVER_DH_INNER_DATA,
  CLIENT_DH_INNER_DATA,
  SET_CLIENT_DH_PARAMS,
  DH_GEN_OK,
  DH_GEN_FAIL,
  DH_GEN_RETRY,
} from './constants';
import {
  bigIntToUint8Array,
  findPrimeFactors,
  getMessageId,
  getRandomInt,
  uint8ToBigInt,
  arrayBufferToForgeBuffer,
  forgeBufferToArrayBuffer,
  copyBytes,
  getNRandomBytes,
  generateKeyDataFromNonce,
  powModulo, hexToUint8Array, uint8ToArrayBuffer, uint8ArrayToHex,
} from './utils';
import { fromTlString, getStringFromArrayBuffer, toTlString } from './tl/tlSerialization';
import { getPublicKey } from './pems';
import { decryptIge as decryptAesIge, encryptIge as encryptAesIge } from './aes';
import { sha1 } from './sha';

/**
 * Generates message for p q authorization
 * @returns {Object}
 */
export function getInitialDHExchangeMessage() {
  const initMessage = new ArrayBuffer(40);

  const authKeyId = new BigUint64Array(initMessage, 0, 1);
  authKeyId[0] = BigInt(0);

  const messageId = new BigUint64Array(initMessage, 8, 1);
  messageId[0] = getMessageId();

  const messageLength = new Uint32Array(initMessage, 16, 1);
  messageLength[0] = 20;

  const constructor = new Uint32Array(initMessage, 20, 1);
  constructor[0] = REQ_PQ;

  const nonce = new Uint8Array(initMessage, 24, 16);

  for (let i = 0; i < nonce.length; i += 1) {
    nonce[i] = getRandomInt(256);
  }

  return {
    constructor,
    nonce,
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
    buffer: initMessage,
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
  const authKeyId = new BigUint64Array(resPQ, 0, 1);
  const messageId = new BigUint64Array(resPQ, 8, 1);
  const messageLength = new Uint32Array(resPQ, 16, 1);
  const constructor = new Uint32Array(resPQ, 20, 1);
  const nonce = new Uint8Array(resPQ, 24, 16);
  const serverNonce = new Uint8Array(resPQ, 40, 16);
  const pq = new Uint8Array(resPQ, 57, 8);
  const vectorLong = new Uint8Array(resPQ, 68, 4);
  const count = new Uint32Array(resPQ, 72, 1);
  const fingerprint = new Uint8Array(resPQ, 76, 8);
  const fingerprintBuffer = resPQ.slice(76, 84);

  return {
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
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
  const innerPQ = new ArrayBuffer(96);

  const constructor = new Uint32Array(innerPQ, 0, 1);
  constructor[0] = PQ_INNER_DATA;

  const pq = new Uint8Array(innerPQ, 4, 12);

  pq[0] = responsePQ.pq.length;
  for (let i = 0; i < responsePQ.pq.length; i += 1) {
    pq[i + 1] = responsePQ.pq[i];
  }

  const pqValue = uint8ToBigInt(responsePQ.pq);
  const [pValue, qValue] = findPrimeFactors(pqValue);
  const pArray = bigIntToUint8Array(pValue);
  const p = new Uint8Array(innerPQ, 16, 8);
  p[0] = pArray.length;
  for (let i = 0; i < pArray.length; i += 1) p[i + 1] = pArray[i];

  const qArray = bigIntToUint8Array(qValue);
  const q = new Uint8Array(innerPQ, 24, 8);
  q[0] = qArray.length;
  for (let i = 0; i < qArray.length; i += 1) q[i + 1] = qArray[i];

  const nonce = new Uint8Array(innerPQ, 32, 16);
  for (let i = 0; i < responsePQ.nonce.length; i += 1) nonce[i] = responsePQ.nonce[i];

  const serverNonce = new Uint8Array(innerPQ, 48, 16);
  for (let i = 0; i < responsePQ.server_nonce.length; i += 1) {
    serverNonce[i] = responsePQ.server_nonce[i];
  }

  const newNonce = new Uint8Array(innerPQ, 64, 32);
  for (let i = 0; i < 32; i += 1) newNonce[i] = getRandomInt(256);

  return {
    constructor,
    pq,
    p,
    q,
    nonce,
    server_nonce: serverNonce,
    new_nonce: newNonce,
    buffer: innerPQ,
  };
}

export function encryptPQInner(responsePQ, pqInnerData) {
  const forgePQInnerBuffer = arrayBufferToForgeBuffer(pqInnerData.buffer);
  const hash = sha1(forgePQInnerBuffer);
  const randomBytesCount = 255 - (hash.data.length + forgePQInnerBuffer.data.length);
  const randomBytes = R.pipe(
    R.curry(getNRandomBytes),
    (x) => R.apply(String.fromCharCode, x),
    (x) => forge.util.createBuffer(x),
  )(randomBytesCount);

  const encryptMessage = R.pipe(
    R.map(R.prop('data')),
    R.join(''),
  )([hash, forgePQInnerBuffer, randomBytes]);

  // reverse fingerprint
  const fingerprint = responsePQ.fingerprint.map((x) => x).reverse();
  const pubKey = getPublicKey(fingerprint);
  const encryptedData = pubKey.encrypt(encryptMessage, 'RAW');
  const encryptedDataBuffer = forge.util.createBuffer(encryptedData);
  const encryptedArrayBuffer = forgeBufferToArrayBuffer(encryptedDataBuffer);

  return {
    encryptedData,
    buffer: encryptedArrayBuffer,
  };
}


/**
 *
 * @param {Object} innerPQ - object with inner pq data
 * @param {Object} encryptedBuffer - object with encrypted inner pq data
 */
export function buildDHExchangeMessage(responsePQ, innerPQ, encryptedBuffer) {
  const messageBuffer = new ArrayBuffer(340);

  const authKeyId = new BigUint64Array(messageBuffer, 0, 1);
  authKeyId[0] = BigInt(0);

  const messageId = new BigUint64Array(messageBuffer, 8, 1);
  messageId[0] = getMessageId();

  const messageLength = new Uint32Array(messageBuffer, 16, 1);
  messageLength[0] = 320;

  const constructor = new Uint32Array(messageBuffer, 20, 1);
  constructor[0] = REQ_DH_PARAMS;

  const nonce = new Uint8Array(messageBuffer, 24, 16);
  copyBytes(innerPQ.nonce, nonce);

  const serverNonce = new Uint8Array(messageBuffer, 40, 16);
  copyBytes(responsePQ.server_nonce, serverNonce);

  const p = new Uint8Array(messageBuffer, 56, 8);
  copyBytes(innerPQ.p, p);

  const q = new Uint8Array(messageBuffer, 64, 8);
  copyBytes(innerPQ.q, q);

  const fingerprint = new Uint8Array(messageBuffer, 72, 8);
  copyBytes(responsePQ.fingerprint, fingerprint);

  const bigLenId = new Uint8Array(messageBuffer, 80, 4);
  bigLenId[0] = 254;
  bigLenId[1] = 0;
  bigLenId[2] = 1;

  const bufferArray = new Uint8Array(encryptedBuffer.buffer);
  const encryptedData = new Uint8Array(messageBuffer, 84, 256);
  copyBytes(bufferArray, encryptedData);

  return {
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
    operation: constructor,
    nonce,
    server_nonce: serverNonce,
    p,
    q,
    fingerprint,
    encrypted_data: encryptedData,
    buffer: messageBuffer,
  };
}

/**
 * Parses response with servers DH params exchange.
 * Raises error if response has got SERVER_DH_PARAMS_FAIL constructor
 * @param {ArrayBuffer} buffer - dh response as ArrayBuffer
 * @return {Object} - object with encrypted data
 */
export function parseDHParamsResponse(buffer) {
  const authKeyId = new BigUint64Array(buffer, 0, 1);
  const messageId = new BigUint64Array(buffer, 8, 1);
  const messageLength = new Uint32Array(buffer, 16, 1);
  const operation = new Uint32Array(buffer, 20, 1);

  if (operation[0] === SERVER_DH_PARAMS_FAIL) {
    const message = 'Server dh params receive failed';
    console.error(message);
    const error = new Error(message);
    throw error;
  }
  console.log('Server dh param received');

  const nonce = new Uint8Array(buffer, 24, 16);
  const serverNonce = new Uint8Array(buffer, 40, 16);
  const encryptedAnswerTl = new Uint8Array(buffer, 56);
  const encryptedAnswer = fromTlString(encryptedAnswerTl);

  return {
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
    nonce,
    server_nonce: serverNonce,
    encrypted_answer_tl: encryptedAnswerTl,
    encrypted_answer: encryptedAnswer,
    buffer,
  };
}

/**
 * Parses dh params with data from encoded buffer
 * @param {ArrayBuffer} buffer
 * @returns {Object}
 */
function parseDHParams(buffer) {
  const constructor = new Uint32Array(buffer, 0, 1);
  if (constructor[0] !== SERVER_DH_INNER_DATA) {
    const message = 'Decryption error';
    console.error(message);
    throw new Error(message);
  }
  console.log(`Decrypted size: ${buffer.byteLength}`);

  const nonce = new Uint8Array(buffer, 4, 16);
  const serverNonce = new Uint8Array(buffer, 20, 16);
  const g = new Uint32Array(buffer, 36, 1);

  const {
    offset: dhPrimeOffset,
    incomingString: dhPrime,
  } = getStringFromArrayBuffer(buffer, 40);

  const {
    offset: gaOffset,
    incomingString: ga,
  } = getStringFromArrayBuffer(buffer, dhPrimeOffset);

  const serverTime = new Uint32Array(buffer, gaOffset, 1);

  return {
    constructor,
    nonce,
    server_nonce: serverNonce,
    g,
    dh_prime: dhPrime,
    ga,
    serverTime,
  };
}

/**
 * Decryptes inner data of dh params and build object for them
 * @param encryptedDHParams
 * @param pqInnerData
 * @returns {{}}
 */
export function decryptDHParams(encryptedDHParams, pqInnerData) {
  console.log('Decrypt DH Params');
  const { key, iv } = generateKeyDataFromNonce(
    encryptedDHParams.server_nonce,
    pqInnerData.new_nonce,
  );

  const encryptedAnswerBuffer = forge.util.createBuffer();
  for (let i = 0; i < encryptedDHParams.encrypted_answer.length; i += 1) {
    encryptedAnswerBuffer.putByte(encryptedDHParams.encrypted_answer[i]);
  }

  const answerForgeBuffer = decryptAesIge(encryptedAnswerBuffer, key, iv);
  const answerBuffer = forgeBufferToArrayBuffer(answerForgeBuffer);
  const answerWithoutHash = answerBuffer.slice(20);

  return {
    key,
    iv,
    ...parseDHParams(answerWithoutHash),
  };
}

/**
 * Takes decrypted dhParams and builds gab, ga values
 * @param dhParams
 */
export function dhComputation(dhParams) {
  const b = uint8ToBigInt(getNRandomBytes(256));

  const ga = uint8ToBigInt(dhParams.ga);
  const g = BigInt(dhParams.g[0]);
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
 * @returns {Object}
 */
export function buildDHInnerMessage(encryptedDHParams, dhValues) {
  const gbArray = toTlString(bigIntToUint8Array(dhValues.gb));

  const bytesLength = 4 + 16 + 16 + 8 + gbArray.length;
  const buffer = new ArrayBuffer(bytesLength);

  const constructor = new Uint32Array(buffer, 0, 1);
  constructor[0] = CLIENT_DH_INNER_DATA;

  const nonce = new Uint8Array(buffer, 4, 16);
  copyBytes(encryptedDHParams.nonce, nonce);

  const serverNonce = new Uint8Array(buffer, 20, 16);
  copyBytes(encryptedDHParams.server_nonce, serverNonce);

  const retryId = new Uint8Array(buffer, 36, 8);
  retryId[0] = 0;

  const gb = new Uint8Array(buffer, 44);
  copyBytes(gbArray, gb);

  return {
    constructor,
    nonce,
    server_nonce: serverNonce,
    retry_id: retryId,
    gb,
    buffer,
  };
}

/**
 * Encrypts messsage with key and iv values
 * @param {Object} dhInnerMessage
 * @param {forge.util.ByteBuffer} key
 * @param {forge.util.ByteBuffer} iv
 * @returns enc
 */
export function encryptInnerMessage(dhInnerMessage, key, iv) {
  const innerHash = sha1(dhInnerMessage.buffer);
  const innerHashBytes = hexToUint8Array(innerHash.toHex());
  const dataWithHashLength = innerHashBytes.length + dhInnerMessage.buffer.byteLength;
  const randomDataLength = (16 - (dataWithHashLength % 16)) % 16;

  const dataWithHashBuffer = new ArrayBuffer(dataWithHashLength + randomDataLength);
  const hashBytes = new Uint8Array(dataWithHashBuffer, 0, innerHashBytes.length);
  copyBytes(innerHashBytes, hashBytes);

  const dhInnerMessageBytes = new Uint8Array(dhInnerMessage.buffer);
  const messageBytes = new Uint8Array(
    dataWithHashBuffer,
    innerHashBytes.length,
    dhInnerMessageBytes.length,
  );
  copyBytes(dhInnerMessageBytes, messageBytes);

  const randomBytes = getNRandomBytes(randomDataLength);
  const randomMessageBytes = new Uint8Array(dataWithHashBuffer, dataWithHashLength);
  copyBytes(randomBytes, randomMessageBytes);

  const dataWithHashForgeBuffer = arrayBufferToForgeBuffer(dataWithHashBuffer);
  const encryptedMessageForgeBuffer = encryptAesIge(dataWithHashForgeBuffer, key, iv);
  const encryptedMessageBuffer = forgeBufferToArrayBuffer(encryptedMessageForgeBuffer);

  return {
    encryptedMessage: new Uint8Array(encryptedMessageBuffer),
    buffer: encryptedMessageBuffer,
  };
}

export function buildSetClientDhParamsMessage(encodedMessage, dhParams) {
  const buffer = new ArrayBuffer(396);

  const authKeyId = new BigUint64Array(buffer, 0, 1);
  authKeyId[0] = BigInt(0);

  const messageId = new BigUint64Array(buffer, 8, 1);
  messageId[0] = getMessageId();

  const messageLength = new Uint32Array(buffer, 16, 1);
  messageLength[0] = 376;

  const constructor = new Uint32Array(buffer, 20, 1);
  constructor[0] = SET_CLIENT_DH_PARAMS;

  const nonce = new Uint8Array(buffer, 24, 16);
  copyBytes(dhParams.nonce, nonce);

  const serverNonce = new Uint8Array(buffer, 40, 16);
  copyBytes(dhParams.server_nonce, serverNonce);

  const encryptedTlString = toTlString(encodedMessage.encryptedMessage);
  const encryptedMessageData = new Uint8Array(buffer, 56);
  copyBytes(encryptedTlString, encryptedMessageData);

  return {
    buffer,
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
    constructor,
    nonce,
    server_nonce: serverNonce,
    encryptedMessage: encodedMessage.encryptedMessage,
    encryptedMessageTlString: encryptedTlString,
  };
}

export function parseDHVerifyResopnse(buffer) {
  const authKeyId = new BigUint64Array(buffer, 0, 1);
  const messageId = new BigUint64Array(buffer, 8, 1);
  const messageLength = new Uint32Array(buffer, 16, 1);
  const constructor = new Uint32Array(buffer, 20, 1);
  const nonce = new Uint8Array(buffer, 24, 16);
  const serverNonce = new Uint8Array(buffer, 40, 16);
  const newNonce = new Uint8Array(buffer, 56, 16);

  return {
    auth_key_id: authKeyId,
    message_id: messageId,
    message_length: messageLength,
    constructor,
    nonce,
    server_nonce: serverNonce,
    new_nonce: newNonce,
  };
}

export function checkDHVerifyResponse({ constructor }) {
  if (constructor[0] === DH_GEN_FAIL) {
    const errorMessage = 'DH generation failed';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (constructor[0] === DH_GEN_RETRY) {
    const errorMessage = 'DH generation need to be retried';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (constructor[0] !== DH_GEN_OK) {
    const errorMessage = 'Unexpected DH generation error';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log('DH generation successfully finished');
}

function buildAuthKeyHash(authKey) {
  const authKeyBuffer = new ArrayBuffer(authKey.length);
  const authKeyBufferBytes = new Uint8Array(authKeyBuffer);
  copyBytes(authKey, authKeyBufferBytes);
  return R.pipe(
    sha1,
    (x) => x.toHex(),
    hexToUint8Array,
  )(authKeyBuffer);
}

const buildAuthKeyId = R.slice(12, 20);
const buildAuthKeyAuxHash = R.slice(0, 8);

function verifyNewNonce(newNonce, authKeyAuxHash, verifyResponse) {
  // Add 1 for nonceNumber
  const nonceNumberWithAuxHash = R.flatten([newNonce, [1], authKeyAuxHash]);

  const buffer = uint8ToArrayBuffer(nonceNumberWithAuxHash);
  const result = sha1(buffer);
  if (result.toHex().slice(8) !== uint8ArrayToHex(verifyResponse.new_nonce)) {
    const message = 'Verify new nonce issue';
    console.error(message);
    throw new Error(message);
  }
}

function buildSalt({ server_nonce: serverNonce, new_nonce: newNonce }) {
  const salt = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    /* eslint-disable */
    salt[i] = newNonce[i] ^ serverNonce[i];
    /* eslint-enable */
  }
  return salt;
}

export default function createAuthorizationKey(sendRequest) {
  const initDHMessage = getInitialDHExchangeMessage();

  return Promise.race([
    sendRequest(initDHMessage.buffer)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        console.log('Parse response PQ');

        const responsePQ = parseResponsePQ(buffer);
        if (!areNonceEqual(initDHMessage, responsePQ)) {
          throw Error('Nonce are not equal');
        }

        const pqInnerData = buildPQInnerData(responsePQ);
        const encryptedData = encryptPQInner(responsePQ, pqInnerData);

        const exchangeMessage = buildDHExchangeMessage(responsePQ, pqInnerData, encryptedData);

        return Promise.all([
          sendRequest(exchangeMessage.buffer)
            .then((response) => response.arrayBuffer()),
          new Promise((resolve) => resolve(pqInnerData)),
        ]);
      })
      .then(([buffer, pqInnerData]) => {
        const encryptedDHParams = parseDHParamsResponse(buffer);
        if (
          !areNonceEqual(encryptedDHParams, pqInnerData)
          || !areNonceEqual(encryptedDHParams, pqInnerData, 'server_nonce')
        ) {
          throw Error('Nonce are not equal');
        }
        const dhParams = decryptDHParams(encryptedDHParams, pqInnerData);
        const dhValues = dhComputation(dhParams);
        const dhInnerMessage = buildDHInnerMessage(dhParams, dhValues);
        const encryptedMessage = encryptInnerMessage(dhInnerMessage, dhParams.key, dhParams.iv);
        const setClientDHParamsMessage = buildSetClientDhParamsMessage(encryptedMessage, dhParams);
        return Promise.all([
          sendRequest(setClientDHParamsMessage.buffer)
            .then((response) => response.arrayBuffer()),
          Promise.resolve(dhValues),
          Promise.resolve(pqInnerData),
        ]);
      })
      .then(([responseBuffer, dhValues, pqInnerData]) => {
        const verifyResponse = parseDHVerifyResopnse(responseBuffer);
        checkDHVerifyResponse(verifyResponse);
        const serverSalt = buildSalt(pqInnerData);
        const authKey = bigIntToUint8Array(dhValues.gab);
        const authKeyHash = buildAuthKeyHash(authKey);
        console.log('Auth key hash: ', authKeyHash);
        const authKeyId = buildAuthKeyId(authKeyHash);
        console.log('Auth key id: ', authKeyId);
        console.log('Auth key id hex: ', uint8ArrayToHex(authKeyId));
        console.log('Server salt:', serverSalt);
        const authKeyAuxHash = buildAuthKeyAuxHash(authKeyHash);

        verifyNewNonce(pqInnerData.new_nonce, authKeyAuxHash, verifyResponse);

        return { authKey, authKeyId, serverSalt };
      }),
    new Promise((resolve, reject) => setTimeout(reject, 600 * 100))
      .then(() => {
        console.log('request is too long');
      }),
  ]);
}
