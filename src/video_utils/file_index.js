// import * as $ from 'jquery'

// import crypto from 'crypto';

const fs = require('fs');
const path = require('path');

const { spawn, execFile } = require('child_process');



let resultArr = [];
let objArr=[];

function getDirFileName(dir, fileName) {
  console.log('=========dir:' + dir);
  let dirPath = path.resolve(__dirname, dir);
  console.log('=========dirPath:' + dirPath);
  let files = fs.readdirSync(dirPath);
  const tempArr = [];

  files.forEach((_file) => {
    let filePath = dirPath + '/' + _file;

    if (fs.statSync(filePath).isDirectory()) {
      getDirFileName(filePath, fileName);
    } else {
      resultArr.push(_file);
      tempArr.push(_file);
    }
  })

  console.log('以下是文件名详情：====');
  console.log(tempArr);
  for (let i = 0; i < tempArr.length; i++) {
    const paths = tempArr[i];
    readFile(tempArr[i]);
  }
  return resultArr;

}

function readFile(filePath) {
  // 异步读取文件内容
  fs.readFile('./htmlFiles/'+filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    // console.log('File content:', data);

    const regex = /(m3u8.*source)/;

    const match = data.match(regex);
    console.log('有符合的：', match[0]);
    //<title>你狠拉德季开了个店健身房啦发撒</title>
    const regex2 = /<title>(.*?)<\/title>/;

    const match2 = data.match(regex2);
    // console.log('有符合的：', match2[1].split(' ').join('-').split('！').join('-').split('，').join('-'));
    objArr.push({title:match2[1].split(' ').join('-').split('！').join('-').split('，').join('-')+'.mp4',source:parseString(match[0])});
    if(objArr.length===resultArr.length){
      console.log('解释完成，去下载了',objArr.length,objArr);
     download(objArr)
    }
  });
}

// surrit.com 由 Cloudflare 做 TLS 指纹识别：ffmpeg(GnuTLS)/Node(OpenSSL) 会被 403/挑战页拦截，
// 只有 curl.exe(Schannel) 可以通过，因此所有 HTTP 请求走 curl，ffmpeg 仅做本地合并。
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const REFERER = 'https://missav.ws/';

function curlText(url) {
  return new Promise((resolve, reject) => {
    execFile('curl.exe', ['-s', '--fail', '--retry', '3', '--connect-timeout', '15', '--max-time', '30', '-A', UA, '-e', REFERER, url],
      { maxBuffer: 20 * 1024 * 1024 }, (err, stdout) => (err ? reject(err) : resolve(stdout)));
  });
}

function curlDownloadBatch(urls, dir) {
  return new Promise((resolve, reject) => {
    const args = ['-s', '--fail', '--retry', '3', '--connect-timeout', '15', '--max-time', '180',
      '--parallel', '--parallel-max', '8',
      '-A', UA, '-e', REFERER, '--remote-name', '--output-dir', dir, ...urls];
    const p = spawn('curl.exe', args);
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`curl 批量下载退出码 ${code}`))));
  });
}

async function downloadOne(obj, index) {
  const outputFilename = 'video/' + obj.title;
  console.log(`\n[${index + 1}] ${outputFilename}`);

  // 1. 取 master playlist，选最高分辨率（无 STREAM-INF 则本身就是媒体 playlist）
  const master = await curlText(obj.source);
  const lines = master.split(/\r?\n/);
  let best = null, bestArea = -1, pendingInfo = null;
  for (const line of lines) {
    if (line.startsWith('#EXT-X-STREAM-INF')) {
      const m = line.match(/RESOLUTION=(\d+)x(\d+)/);
      pendingInfo = m ? { w: +m[1], h: +m[2] } : { w: 0, h: 0 };
    } else if (line && !line.startsWith('#') && pendingInfo) {
      const area = pendingInfo.w * pendingInfo.h;
      if (area > bestArea) { bestArea = area; best = line; }
      pendingInfo = null;
    }
  }
  const variantUrl = best ? new URL(best, obj.source).href : obj.source;
  console.log(`    选中流: ${variantUrl}`);

  // 2. 取媒体 playlist，提取分片列表
  const media = best ? await curlText(variantUrl) : master;
  const segments = media.split(/\r?\n/).filter(l => l && !l.startsWith('#'));
  console.log(`    分片数量: ${segments.length}`);

  // 3. curl 并发批量下载分片
  const tmpDir = path.join('video', `.tmp-${index}-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });
  const BATCH = 50;
  for (let i = 0; i < segments.length; i += BATCH) {
    const urls = segments.slice(i, i + BATCH).map(s => new URL(s, variantUrl).href);
    await curlDownloadBatch(urls, tmpDir);
    console.log(`    已下载分片 ${Math.min(i + BATCH, segments.length)}/${segments.length}`);
  }

  // 4. 按播放顺序合并分片为单个 TS，再由 ffmpeg 本地转封装为 mp4
  const combined = path.join(tmpDir, 'combined.ts');
  for (const s of segments) {
    fs.appendFileSync(combined, fs.readFileSync(path.join(tmpDir, path.basename(s))));
  }
  await new Promise((resolve) => {
    const ffmpegProcess = spawn('ffmpeg', ['-y', '-i', combined, '-c', 'copy', '-bsf:a', 'aac_adtstoasc', outputFilename]);
    let errBuf = '';
    ffmpegProcess.stderr.on('data', (data) => { errBuf += data.toString(); });
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Video downloaded successfully: ${outputFilename}`);
      } else {
        console.error(`ffmpeg process exited with code ${code} for ${outputFilename}`);
        console.error(`--- stderr tail (last 2000 chars) ---`);
        console.error(errBuf.slice(-2000));
        console.error(`--- stderr end ---`);
      }
      resolve();
    });
  });

  // 5. 清理临时分片目录
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

async function download(hlsUrls) {
  fs.mkdirSync('video', { recursive: true });
  for (let i = 0; i < hlsUrls.length; i++) {
    try {
      await downloadOne(hlsUrls[i], i);
    } catch (e) {
      console.error(`下载失败: ${hlsUrls[i].title}\n  ${e.message}`);
    }
  }
  console.log('\n全部处理完成');
}

function parseString(str){
  const arr=str.split('|');
  for (let i = 0; i < arr.length; i++) {
      console.log(`i:${i},val:${arr[i]}`)
  }
  const url=`https://surrit.com/${arr[5]}-${arr[4]}-${arr[3]}-${arr[2]}-${arr[1]}/playlist.m3u8`;
  console.log(`url:${url}`);
  return url;
}



/* fs.readFile('/Users/bytedance/Personal/Project/react_next_demo/src/pages/index.tsx','ascii',(err,data)=>{
  if(err){
    console.log('the file is error:',err);
  }else{
    console.log(data);
  }
}); */
getDirFileName('htmlFiles');
const str = `总共有${resultArr.length}个文件`;
console.log(str);


