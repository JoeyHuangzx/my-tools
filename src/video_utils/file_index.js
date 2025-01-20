// import * as $ from 'jquery'

// import crypto from 'crypto';

const fs = require('fs');
const path = require('path');

const { spawn  } = require('child_process');



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

function download(hlsUrls){
  hlsUrls.forEach((obj, index) => {
    const outputFilename ="video/"+ obj.title;
    console.log(outputFilename);
  
    const ffmpegCommand = 'ffmpeg';
    // const parseUrl=parseString(hlsUrl);
    const ffmpegArgs = ['-i', obj.source, '-c', 'copy', '-bsf:a', 'aac_adtstoasc', outputFilename];

    const ffmpegProcess = spawn(ffmpegCommand, ffmpegArgs);

    /* ffmpegProcess.stdout.on('data', (data) => {
        console.log(`stdout (${outputFilename}): ${data}`);
    }); */

    ffmpegProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const timeMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
      if (timeMatch) {
        console.log(`file:${outputFilename}, Current time: ${timeMatch[1]}`);
      }
    });

    ffmpegProcess.on('close', (code) => {
        if (code === 0) {
            console.log(`Video downloaded successfully: ${outputFilename}`);
        } else {
            console.error(`ffmpeg process exited with code ${code} for ${outputFilename}`);
        }
    });
});
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


