import fs from 'fs';
import * as glob from 'glob';
import axios from 'axios';
import md5File from 'md5-file';
class TinyPng {
  /**
   * 获取一批要压缩的图片的路径
   * @param param 要压缩的图片的相关参数
   * @param tinyfiedMd5 已经压缩的图片的md5信息，用于判断是否需要压缩
   * @returns 要压缩的所有图片的路径
   */
  getImagePath(param, tinyfiedMd5 = []) {
    // 参数解析
    let { imageRegExp, imageIgnoreRegExp = '', minCompressSize = 0 } = param;
    // 根据正则获取到所有要压缩的图片的路径
    let imagePath = glob.sync(imageRegExp, { ignore: imageIgnoreRegExp });
    // 过滤掉小于最小压缩大小的图片
    imagePath = imagePath.filter(one => {
      let stat = fs.statSync(one);
      return stat.size > minCompressSize;
    });
    // 过滤掉已经压缩过的图片
    imagePath = imagePath.filter(one => {
      let md5 = md5File.sync(one);
      return !tinyfiedMd5.includes(md5);
    });
    return imagePath;
  }
  /**
   * 批量压缩一些图片
   * @param param 要压缩的图片的相关参数
   */
  async tinyfy(param) {
    // 参数解析
    let { tinyfyConfigs, tinyfiedMd5 = [], minCompressRate = 0, concurrents = 10, onProgress } = param;
    // 本次要压缩的所有图片的路径
    let allImagePath = [];
    // 依次获取所有要压缩的图片的路径
    for (let one of tinyfyConfigs) {
      let imagePath = this.getImagePath(one, tinyfiedMd5);
      allImagePath.push(...imagePath);
    }
    console.log('[tinyPng] 本次要压缩的图片数量：', allImagePath.length);
    console.log('[tinyPng] 本次要压缩的图片路径：', allImagePath);
    // 记录压缩成功和未压缩的图片
    let tinyfied = [];
    let untiny = [];
    // 依次压缩所有要压缩的图片
    let count = 0;
    let all = [];
    let times = 0;
    let { length } = allImagePath;
    for (let i = 0; i < length; i++) {
      let imagePath = allImagePath[i];
      // 失败后循环请求，保证一定请求成功
      const circularRequest = async imagePath => {
        try {
          let isTinyfied = await this.fullCompress(imagePath, minCompressRate);
          // 统计压缩成功和未压缩的图片
          if (isTinyfied) {
            tinyfied.push(imagePath);
          } else {
            untiny.push(imagePath);
          }
        } catch (error) {
          await circularRequest(imagePath);
        }
      };
      const compressOne = async () => {
        await circularRequest(imagePath);
        console.log(`[tinyPng] 压缩进度：${i + 1}/${length}`);
        // 如果有进度回调函数，则调用
        onProgress?.(i + 1, length);
      };
      all.push(compressOne());
      count++;
      // 如果当前批次的数量达到并行压缩数量，或者是最后一张图片，则等待一批压缩完成
      if (count >= concurrents || i >= length - 1) {
        // 等待一批压缩完成
        await Promise.all(all);
        times++;
        console.log('[tinyPng] 压缩完成批次：', times);
        // 数据还原
        count = 0;
        all.length = 0;
      }
    }
    console.log('[tinyPng] ==================== 压缩完成 ====================');
    console.log('[tinyPng] 本次已压缩的图片数量：', tinyfied.length);
    console.log('[tinyPng] 本次已压缩的图片路径：', tinyfied);
    console.log('[tinyPng] 本次未压缩的图片数量：', untiny.length);
    console.log('[tinyPng] 本次未压缩的图片路径：', untiny);
    // 返回压缩结果
    return { tinyfied, untiny };
  }
  /**
   * 上传图片到远程服务器，获得压缩后的信息
   * @param imagePath 图片路径
   */
  async upload(imagePath) {
    // 读取本地文件
    let imageData = fs.createReadStream(imagePath);
    // 请求 tinypng 接口，上传本地文件到远程
    let rsp = await axios.post('https://tinypng.com/backend/opt/shrink', imageData, {
      headers: {
        rejectUnauthorized: false,
        'X-Forwarded-For': Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.'), // mock随机ip
        'Postman-Token': Date.now(),
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      },
    });
    // 返回需要的数据 (ratio, url)
    return rsp.data.output;
  }
  /**
   * 将远程压缩的图片下载到本地
   * @param url 远程压缩好的图片路径
   * @param imagePath 本地图片路径
   */
  async download(url, imagePath) {
    let rsp = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(imagePath);
    rsp.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
  /**
   * 压缩一张图片的完整流程
   * @param imagePath 图片路径
   * @param minCompressRate 最小压缩比例
   * @returns 是否压缩（压缩比例过低时候不压缩）
   */
  async fullCompress(imagePath, minCompressRate = 0) {
    // 1.上传图片到远程服务器，获得压缩后的信息
    let { ratio, url } = await this.upload(imagePath);
    // 2.检查压缩比例是否合格，合格的话，则下载到本地
    if ((1 - ratio) * 100 > minCompressRate) {
      // 正常压缩，可以替换
      await this.download(url, imagePath);
      console.warn('[tinyPng] 压缩完一张图片：', imagePath, `压缩比例：${(1 - ratio) * 100}%`);
      return true;
    } else {
      // 压缩比例过低，不替换
      console.warn(
        '[tinyPng] 压缩比例过低，不替换:',
        imagePath,
        '压缩比例：',
        (1 - ratio) * 100,
        '最小比例：',
        minCompressRate,
      );
      return false;
    }
  }
}
/**
 * 使用tinypng批量压缩图片的原子能力
 * @see
 */
const tinyPng = new TinyPng();
export default tinyPng;
