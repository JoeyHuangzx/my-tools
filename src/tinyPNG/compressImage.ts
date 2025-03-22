import axios from 'axios';
import fs from 'fs';

const TINYPNG_URL = 'https://tinypng.com/web/shrink';

// TODO 实现批量压缩，简化压缩流程

export async function compressImage(src: string, dist: string) {
  const stream = fs.createReadStream(src);
  console.log(`start tiny compress,src:${src} `);
  console.log(`dist:${dist}`);
  // 读取本地文件
  let imageData = fs.createReadStream(src);
  // 请求 tinypng 接口，上传本地文件到远程
  let rsp = await axios.post('https://tinypng.com/backend/opt/shrink', imageData, {
    /* headers: {
      rejectUnauthorized: false,
      'X-Forwarded-For': Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.'), // mock随机ip
      'Postman-Token': Date.now(),
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    }, */
  });
  // 返回需要的数据 (ratio, url)
  // 1.上传图片到远程服务器，获得压缩后的信息
  let { ratio, url } = await rsp.data.output;
  console.log(rsp.data);
  downloadFile(url, dist);
  console.log(
    `compress png size:${rsp.data.input.size / 1000}k, download:${rsp.data.output.size / 1000}k, ratio:${ratio}`,
  );
}

export async function downloadFile(url: string, imagePath: string): Promise<void> {
  let rsp = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(imagePath);
  rsp.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve();
    });
    writer.on('error', reject);
  });
}
