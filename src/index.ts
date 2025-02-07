import { checkAndCreateDir, fileMover } from './utils/fileMover';
import { exportDirectoryToJson } from './utils/traverse';

// moveFile('path/to/source/file.txt', 'path/to/destination/');

const args=process.argv;
console.log(args[2]);
// exportDirectoryToJson(args[2],'output.json')
// fileMover('test.txt','/Users/huangzuxiang/Desktop/test.txt');
checkAndCreateDir('');
console.log("这是工具的入口文件");
