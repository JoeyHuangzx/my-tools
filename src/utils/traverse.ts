import fs from 'fs';
import path from 'path';

const nameArr: string[] = [];

export function traverseDirectory(dirPath: string) {
    const items = fs.readdirSync(dirPath);
    const result: any = {};

    let onlyFiles = true; // 用于判断是否仅包含文件
    items.forEach((item) => {
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
    })
    if (onlyFiles) {
        return Object.keys(result);
    }
    return { result: result};
}

export function exportDirectoryToJson(dirPath: string, outputFilePath: string) {
    type Info = ReturnType<typeof traverseDirectory>;
    const directoryStructure: Info = traverseDirectory(dirPath);
    if (!Array.isArray(directoryStructure)) {
        const jsonContent = JSON.stringify(directoryStructure.result, null, 2);
        
        fs.writeFileSync(outputFilePath, jsonContent, 'utf-8');
        // console.log(`文件夹结构已成功导出到 ${outputFilePath}`);
    }
    const nameJsonContent = JSON.stringify(nameArr, null, 2);
    console.log(nameArr);
    fs.writeFileSync('output-paths.json', nameJsonContent, 'utf-8');
    console.log('成功导出');
}





