import fs from 'fs';
import path from 'path';
import { traverseDirectory } from './traverse';



export const checkAndCreateDir = (dirPath: string) => {
  type Info = ReturnType<typeof traverseDirectory>;
  /* const result: Info = traverseDirectory(dirPath);
  if (Array.isArray(result)) {
    console.log('目标路径不存在或者不是文件夹');
    return;
  } */
  const nameArr=["abc","test",];
  const jsonPath=path.join(__dirname,'output.json');
  // 读取json文件
  // const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  // 解析JSON
  const jsonObj = ['/Users/huangzuxiang/Desktop/test.txt','/Users/huangzuxiang/Desktop/abc.txt','/Users/huangzuxiang/Desktop/qwe.txt'];//JSON.parse(jsonContent);
  for (let i = 0; i < jsonObj.length; i++) {
    const itemPath:string = jsonObj[i];
    // 判断itemPath的字符串中是否存在nameArr中的元素
    nameArr.forEach((name) => {
      if (itemPath.includes(name)) {
        // 如果存在，移动文件夹
        fileMover(name, itemPath);
      }
    });
    
  }
}

/**
 * 知道文件路径，移动文件夹
 */
export const fileMover = (name:string, sourcePath: string) => {
  const sourceDir = path.dirname(sourcePath);
  const targetDir = path.join(sourceDir, path.parse(sourcePath).name);
  const fileName = path.basename(sourcePath);
  console.log(`sourceDir: ${sourceDir}, targetDir: ${targetDir}, fileName: ${fileName}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  fs.renameSync(sourcePath, path.join(targetDir, fileName));
  return targetDir;
}