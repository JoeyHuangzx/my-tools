const { spawn  } = require('child_process');

// HLS 流 URL 列表
const hlsUrls = [
    'm3u8|c2b67ac97ca8|9ddc|4b72|216e|3acf9cef|com|surrit|https|video|1280x720|source1280|842x480|source842|playlist|source',
    'm3u8|aa827ce4b51f|a87a|46be|0fdd|ae3daaf3|com|surrit|https|video|720p|source1280|source842|playlist|source',
    'm3u8|6aa29be379ef|ab85|4012|5c11|b094fcbf|com|surrit|https|video|1280x720|source1280|842x480|source842|playlist|source',
    'm3u8|506cec6c8efb|9a8a|479a|6461|29280220|com|surrit|https|video|1280x720|source1280|842x480|source842|playlist|source',
];

// 输出文件名列表
const outputFilenames = [
    'fpre-017-菊野蘭想要被大胸名人蕩婦盯著並強姦.mp4',
    'miaa-924-來住的同一個屋簷下性慾強烈的大屁股真正接受挑釁的不忠老男人為熟練的屁股技術而瘋狂.mp4',
    'dlpn-026-我為自己的屁股感到有點驕傲.mp4',
    'meyd-825獨居男人房間裡的乳頭冰豐滿巨乳人妻管家Chinamin.mp4'
];

function parseString(str){
    const arr=str.split('|');
    for (let i = 0; i < arr.length; i++) {
        console.log(`i:${i},val:${arr[i]}`)
    }
    const url=`https://surrit.com/${arr[5]}-${arr[4]}-${arr[3]}-${arr[2]}-${arr[1]}/playlist.m3u8`;
    console.log(`url:${url}`);
    return url;
}

hlsUrls.forEach((hlsUrl, index) => {
    const outputFilename = outputFilenames[index];
    const ffmpegCommand = 'ffmpeg';
    const parseUrl=parseString(hlsUrl);
    const ffmpegArgs = ['-i', parseUrl, '-c', 'copy', outputFilename];

    const ffmpegProcess = spawn(ffmpegCommand, ffmpegArgs);

    ffmpegProcess.stdout.on('data', (data) => {
        console.log(`stdout (${outputFilename}): ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`stderr (${outputFilename}): ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        if (code === 0) {
            console.log(`Video downloaded successfully: ${outputFilename}`);
        } else {
            console.error(`ffmpeg process exited with code ${code} for ${outputFilename}`);
        }
    });
});

// 并发执行多个 ffmpeg 命令
/* hlsUrls.forEach((hlsUrl, index) => {
    const outputFilename = outputFilenames[index];
    const parseUrl=parseString(hlsUrl);
    const ffmpegCommand = `ffmpeg -i "${parseUrl}" -c copy -bsf:a aac_adtstoasc ${outputFilename}`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ffmpeg for ${outputFilename}: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`ffmpeg stderr for ${outputFilename}: ${stderr}`);
            return;
        }
        console.log(`ffmpeg stdout for ${outputFilename}: ${stdout}`);
        console.log(`Video downloaded successfully: ${outputFilename}`);
    });
}); */

// let str='m3u8|1998873a9e04|866c|40ad|97b8|abd4a957|com|surrit|https|video|1080p|source1280|720p|source842|playlist|source';

    
