import * as R from 'ramda';
import { isObjectOf } from './tl/schema/utils';

/**
 * Returns file type string
 * @param {*} typeObj -  Takes telegram file type object,
 * @returns {string}
 */
export const getFileType = R.cond([
  [isObjectOf('storage.fileJpeg'), R.always('image/jpg')],
  [isObjectOf('storage.fileGif'), R.always('image/gif')],
  [isObjectOf('storage.filePng'), R.always('image/png')],
  [isObjectOf('storage.fileMp3'), R.always('audio/mpeg')],
  [isObjectOf('storage.fileMov'), R.always('video/quicktime')],
  [isObjectOf('storage.fileMp4'), R.always('video/mp4')],
  [R.T, R.always(undefined)],
]);

/**
 * Returns file type string
 * @param {*} typeObj -  Takes telegram file type object,
 * @returns {string}
 */
export const getFileName = R.cond([
  [isObjectOf('storage.fileJpeg'), R.always('image.jpg')],
  [isObjectOf('storage.fileGif'), R.always('image.gif')],
  [isObjectOf('storage.filePng'), R.always('image.png')],
  [isObjectOf('storage.fileMp3'), R.always('audio.mp3')],
  [isObjectOf('storage.fileMov'), R.always('video.mov')],
  [isObjectOf('storage.fileMp4'), R.always('video.mp4')],
  [R.T, R.always('file')],
]);
