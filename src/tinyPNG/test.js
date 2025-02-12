'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const base_1 = tslib_1.__importDefault(require('./base'));
const axios_1 = tslib_1.__importDefault(require('axios'));
const fs_1 = tslib_1.__importDefault(require('fs'));
const debug_1 = tslib_1.__importDefault(require('@byted-dino/debug'));
const utils_1 = require('../utils');
const url = 'https://tinypng.com/web/shrink';
class TinyImageMin extends base_1.default {
  async compressImage(src, dist) {
    const stream = fs_1.default.createReadStream(src);
    debug_1.default.log('start tiny compress ', src);
    return new Promise((resolve, reject) => {
      axios_1.default
        .post(url, stream)
        .then(async res => {
          if (res && res.data) {
            const data = res.data;
            await this._downloadFile(data, dist);
            resolve();
          }
        })
        .catch(() => {
          reject(new Error(`tiny compress fail: ${src}, it will use imagemin compress`));
        });
    });
  }
  async _downloadFile(data, dist) {
    const url = data.output.url;
    const response = await axios_1.default({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    const writer = fs_1.default.createWriteStream(dist);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const inputSize = utils_1.getReadableFileSizeString(data.input.size);
        const outputSize = utils_1.getReadableFileSizeString(data.output.size);
        debug_1.default.log(
          '压缩成功',
          `原始大小:${inputSize}`,
          `压缩大小:${outputSize}`,
          `优化比例:${data.output.ratio}`,
        );
        resolve();
      });
      writer.on('error', err => {
        debug_1.default.error(err);
        reject();
      });
    });
  }
}
exports.default = TinyImageMin;
