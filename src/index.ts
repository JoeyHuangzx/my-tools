import { askDeepseek } from './ai/deepseek';
import { askDoubao } from './ai/doubao';
import { checkAndCreateDir, fileMover } from './utils/fileMover';
import { exportDirectoryToJson } from './utils/traverse';
require('dotenv').config();
// moveFile('path/to/source/file.txt', 'path/to/destination/');
console.log("这是工具的入口文件");
const args=process.argv;
console.log(args[2]);
// exportDirectoryToJson(args[2],'output.json')
// fileMover('test.txt','/Users/huangzuxiang/Desktop/test.txt');
// checkAndCreateDir(args[2],__dirname);
console.log(process.env.OPENAI_DOUBAO_API_KEY);
askDoubao(args[2]);

