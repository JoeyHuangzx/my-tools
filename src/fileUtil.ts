
import { exportDirectoryToJson } from './utils/traverse';

console.log("执行文件操作====================");
const args=process.argv;
console.log(args[2]);
exportDirectoryToJson(args[2],'output.json')

