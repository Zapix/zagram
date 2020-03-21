import {
  getConstructor,
  isMessageContainer,
  isPong,
  isNewSessionCreated,
  isBadMsgNotification,
  isMsgsAck,
  isVector,
  isRpcResult,
  isAuthSentCode,
} from './utils';
import { hexToArrayBuffer } from '../utils';

describe('getConstructor()', () => {
  it('test', () => {
    const buffer = hexToArrayBuffer('dcf8f173');
    expect(getConstructor(buffer)).toEqual(0x73f1f8dc);
  });
});

describe('isMessageContainer', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isMessageContainer(buffer)).toEqual(true);
  });

  it('failed', () => {
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);
    expect(isMessageContainer(buffer)).toEqual(false);
  });
});

describe('isPong', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isPong(buffer)).toEqual(true);
  });

  it('failed', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isPong(buffer)).toEqual(false);
  });
});

describe('isNewSe1cb5c415ssionCreated', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isNewSessionCreated(buffer)).toEqual(true);
  });

  it('failed', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isNewSessionCreated(buffer)).toEqual(false);
  });
});

describe('isBadMsgNotification', () => {
  it('success', () => {
    const hexStr = '11f8efa70000000079f60a5e0200000023000000';
    const buffer = hexToArrayBuffer(hexStr);
    expect(isBadMsgNotification(buffer)).toEqual(true);
  });
});

describe('isMsgAck', () => {
  it('success', () => {
    const hexStr = '59b4d66215c4b51c01000000000000007b050b5e';
    // 59b4d662 15c4b51c 01000000 000000007b050b5e
    const buffer = hexToArrayBuffer(hexStr);
    expect(isMsgsAck(buffer)).toEqual(true);
  });
});

describe('isVector', () => {
  it('success', () => {
    const hexStr = '15c4b51c01000000000000007b050b5e';
    const buffer = hexToArrayBuffer(hexStr);
    expect(isVector(buffer)).toEqual(true);
  });
});

describe('isRpcResult', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = '016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);
    expect(isRpcResult(buffer)).toEqual(true);
  });
});

describe('isAuthSentCode', () => {
  it('success', () => {
    const hexStr = 'bdbc1522b57572991235646130343337306165386264323132373800';
    const buffer = hexToArrayBuffer(hexStr);
    expect(isAuthSentCode(buffer)).toEqual(true);
  });
});
