
import { config } from 'dotenv';
import { exportDirectoryToJson } from './utils/traverse';

config();
// moveFile('path/to/source/file.txt', 'path/to/destination/');
console.log("这是工具的入口文件");
const args=process.argv;
console.log(args[2]);
exportDirectoryToJson(args[2],'output.json')

