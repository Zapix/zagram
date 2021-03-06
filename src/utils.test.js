import * as R from 'ramda';
import {
  isPrime,
  findPrimeFactors,
  primeGenerator,
  arrayBufferToHex,
  mergeArrayBuffer,
  hexToArrayBuffer,
  promiseChain,
  promiseChainUntil,
} from './utils';
import {
  buildSecondInitPayload,
  generateFirstInitPayload,
  isValidInitPayload,
} from './obfuscation';

describe('isValidInitPayload()', () => {
  test('invalid first byte', () => {
    const buffer = generateFirstInitPayload();
    const firstByte = new Uint8Array(buffer, 0, 1);
    firstByte[0] = 0xef;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('invalid first int', () => {
    const buffer = generateFirstInitPayload();
    const firstInt = new Uint32Array(buffer, 0, 1);
    firstInt[0] = 0xdddddddd;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('invalid second int', () => {
    const buffer = generateFirstInitPayload();
    const secondInt = new Uint32Array(buffer, 4, 1);
    secondInt[0] = 0x00000000;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('valid init payload', () => {
    const buffer = generateFirstInitPayload();
    expect(isValidInitPayload(buffer)).toBeTruthy();
  });
});

describe('buildSecondInitPayload()', () => {
  const firstInitPayload = generateFirstInitPayload();
  const secondInitPyaload = buildSecondInitPayload(firstInitPayload);

  const firstView = new Uint8Array(firstInitPayload);
  const secondView = new Uint8Array(secondInitPyaload);

  for (let i = 0; i < firstView.length; i += 1) {
    expect(firstView[i]).toEqual(secondView[secondView.length - i - 1]);
  }
});

describe('primeGenerator', () => {
  test('true', () => {
    const gen = primeGenerator();
    for (let i = 0; i < 17; i += 1) {
      const { value } = gen.next();
      expect(isPrime(value)).toBeTruthy();
    }
  });
});

describe('findPrimeFactors', () => {
  test('from telegram example', () => {
    const [p, q] = findPrimeFactors(BigInt('0x17ED48941A08F981'));
    expect(p === BigInt('0x494C553B')).toBeTruthy();
    expect(q === BigInt('0x53911073')).toBeTruthy();
  });

  test('from telegram response', () => {
    const [p, q] = findPrimeFactors(BigInt('0x31f05bcc5ce66ccd'));
    expect(p === BigInt('0x6f7b6a45')).toBeTruthy();
    expect(q === BigInt('0x72ad24e9')).toBeTruthy();
  });

  test('from telegram response 2', () => {
    const [p, q] = findPrimeFactors(BigInt('0x256edefca64f89db'));
    expect(p === BigInt('0x5556e63f')).toBeTruthy();
    expect(q === BigInt('0x704a8d65')).toBeTruthy();
  });
});

describe('mergeArrayBuffers', () => {
  test('merge', () => {
    const bufferA = hexToArrayBuffer('aabbcc');
    const bufferB = hexToArrayBuffer('ffeec0dd');

    const buffer = mergeArrayBuffer(bufferA, bufferB);
    expect(buffer.byteLength).toEqual(7);
    expect(arrayBufferToHex(buffer)).toEqual('aabbccffeec0dd');
  });
});

describe('promiseChain', () => {
  test('successfully finished', (done) => {
    const promiseList = (new Array(100)).fill(1).map((value, idx) => (() => Promise.resolve(idx)));
    const progressCb = jest.fn();

    const { promise } = promiseChain(promiseList, progressCb);
    promise.then((result) => {
      expect(result).toHaveLength(100);
      expect(progressCb).toHaveBeenCalledTimes(101);
      expect(R.last(result)).toEqual(99);
      done();
    });
  });

  test('canceled', (done) => {
    const promiseList = (new Array(100)).fill(1).map(
      (v, i) => () => new Promise((resolve) => setTimeout(() => resolve(i), 100)),
    );
    const progressCb = jest.fn();

    const { promise, cancel } = promiseChain(promiseList, progressCb);
    promise
      .then(() => {
        done(new Error('cancelation does not work'));
      })
      .catch((error) => {
        expect(error.message).toEqual('canceled');
        expect(progressCb).toHaveBeenCalledTimes(4);
        done();
      });
    setTimeout(
      () => {
        cancel();
      },
      350,
    );
  });
});

describe('promiseChainUntil', () => {
  test('test', (done) => {
    const promiseFuncFactory = (prevResult, x) => Promise.resolve(x);
    const conditionFunc = (prevResult) => prevResult === 4;
    const progressCb = jest.fn();

    const { promise } = promiseChainUntil(promiseFuncFactory, conditionFunc, progressCb);
    promise.then((result) => {
      expect(result).toHaveLength(5);
      expect(progressCb).toHaveBeenCalledTimes(6);
      done();
    });
  });

  test('canceled', (done) => {
    const promiseFuncFactory = (prevResult, x) => new Promise(
      (resolve) => setTimeout(() => resolve(x), 100),
    );
    const conditionFunc = (prevResult) => prevResult === 99;
    const progressCb = jest.fn();

    const { promise, cancel } = promiseChainUntil(promiseFuncFactory, conditionFunc, progressCb);
    promise
      .then(() => {
        done(new Error('cancelation does not work'));
      })
      .catch((error) => {
        expect(error.message).toEqual('canceled');
        expect(progressCb).toHaveBeenCalledTimes(4);
        done();
      });
    setTimeout(cancel, 350);
  });
});
