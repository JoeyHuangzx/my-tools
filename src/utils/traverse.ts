import fs from 'fs';
import path from 'path';
import { FolderNode } from './FolderNode';

const nameArr: string[] = [];
const folderNode: FolderNode = new FolderNode('root');
/**
 * 遍历文件夹
 * @param dirPath 文件夹路径
 */
export function traverseDirectory2(dir: string, parent = '') {
  let result: any = {};
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归处理子文件夹
      result[item] = traverseDirectory2(fullPath);
    } else {
      // 收集文件名
      if (!result.files) result.files = [];
      result.files.push(item);
    }
  });

  // 如果文件夹下只有文件，将文件数组作为值
  if (Object.keys(result).length === 1 && result.files) {
    return result.files;
  }

  return result;
}

export function exportDirectoryToJson(dirPath: string, outputFilePath: string) {
  type Info = ReturnType<typeof traverseDirectory2>;
  const result = traverseDirectory2(dirPath);

  const jsonContent = JSON.stringify(result, null, 2);
  console.log(jsonContent);
  fs.writeFileSync(outputFilePath, jsonContent, 'utf-8');
  // if (!Array.isArray(directoryStructure)) {
  //     const jsonContent = JSON.stringify(directoryStructure.result, null, 2);
  //     fs.writeFileSync(outputFilePath, jsonContent, 'utf-8');
  //     console.log(`文件夹结构已成功导出到 ${outputFilePath}`);
  // }else{
  //     const nameJsonContent = JSON.stringify(nameArr, null, 2);
  //     console.log(nameArr);
  //     fs.writeFileSync(outputFilePath, nameJsonContent, 'utf-8');
  // }

  console.log('成功导出');
}

export function traverseDirectory(dirPath: string) {
  const items = fs.readdirSync(dirPath);
  const result: any = {};

  let onlyFiles = true; // 用于判断是否仅包含文件
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      onlyFiles = false;
      result[item] = traverseDirectory(itemPath);
    } else {
      result[item] = null;
      nameArr.push(itemPath);
      console.log(itemPath);
    }
  });
  if (onlyFiles) {
    return Object.keys(result);
  }
  return { result: result };
}
