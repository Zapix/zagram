import * as R from 'ramda';
import forge from 'node-forge';
import { arrayBufferToForgeBuffer } from './utils';

const prepareData = R.cond([
  [R.is(ArrayBuffer), arrayBufferToForgeBuffer],
  [R.T, R.identity],
]);

function sha(md, data) {
  md.update(data.bytes());
  return md.digest();
}

/**
 * Returns
 * @param {ArrayBuffer|forge.util.ByteBuffer} data
 * @returns {*}
 */
export function sha1(data) {
  const md = forge.md.sha1.create();
  const preparedData = prepareData(data);
  return sha(md, preparedData);
}

export function sha256(data) {
  const md = forge.md.sha256.create();
  const preparedData = prepareData(data);
  return sha(md, preparedData);
}
