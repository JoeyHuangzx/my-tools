import fs from 'fs';
import path from 'path';
import { traverseDirectory } from './traverse';


const arr1=["e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\IPX-986 不自覺地向不穿胸罩的乳頭提出上訴的巨乳姐姐 自然淫蕩的誘惑性愛摩擦 Lcup 詛咒我的神聖乳房.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JJDA-029 若月美奈溫柔溫柔的巨乳大媽偷偷給來東京培訓的處女員工按摩老公 - 若月美衣奈 - Mis.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUC-550 我老婆快生了我和嫂子來幫忙做家務的我濱崎里里奧 - 濱崎里緒 森下繪梨香篠原繪梨香 -.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUL-030 將情人約到家裡緊密交合精液連同汗液一起進入子宮深處最後懷孕的人妻三個孩子都是別人的哦 飯山香織.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUL-598 婚前迷戀媽媽的美乳人妻好友告白狂幹 米倉穂香 - 米倉穗香 - MissAV 免費高清AV.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUL-774 每時每刻都在想著女婿肉棒 難以忍耐的義母誘惑 米倉穗香 - MissAV 免費高清AV在線.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUL-948 麥當娜獨家第2話不到一秒就喜歡的已婚女人被汗水和愛汁覆蓋的舌頭瘋狂地接吻性交 Nina.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUQ-209 炎炎夏日外國妻子與討厭的公公發生親吻性交交織著汗水和口水勞倫凱倫 - ローレン花戀 -.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUQ-379 當我同情我的姐夫他已經30歲了仍然是處女並接受了他的畢生願望時我們是如此契合以至於我.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUQ-662 絕對只有3公分讓性慾旺盛的繼父插入了一會兒結果竟然是絕配高潮了一遍又一遍再次廣.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUQ-786 請讓我插入你吧因為一瞬間就好了我同情三十歲仍是處女的姐夫並接受了他的畢生願望但他.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\JUQ-902 請讓我插入你吧因為一瞬間就好了當我同情三十歲仍是處女的姐夫並接受他的畢生願望時我們.mp4",
  "e:\\i4Tools7\\Files\\程序\\A乱炖\\JU\\LUXU-685 豪華電視642 - MissAV 免費高清AV在線看.mp4"]

const arr2=[
  "通野未帆",
  "美月アンシ",
  "果梨奈_星野みかん",
  "若宮葉月",
  "西野エリカ",
  "菅野松雪",
  "仁科百華",
  "蒼井まなみ",
  "Hinata_Komine",
  "若月美衣奈",
  "飯山香織",
  "米倉穗香",
  "ローレン花戀",
  "一之瀨亞美里",
  "高岡すみれ",
  "桐嶋莉乃",
  "有賀みなほ",
  "七瀨雛",
  "木下日葵",
  "卯水咲流",
  "希代亞美",
  "Reia_Kawakami",
  "七草千歲",
  "桃瀬くるみ",
  "Emiri-Momoka",
  "愛乃奈美",
  "愛實麗",
  "中山理莉",
  "小西悠",
  "叶優莉亞",
  "前田桃杏",
  "夕美紫苑",
  "みなと羽琉",
  "百花エミリ"
];
export const checkAndCreateDir = (dirPath: string,basePath:string) => {
  type Info = ReturnType<typeof traverseDirectory>;
  const result: Info = traverseDirectory(dirPath);
  if (Array.isArray(result)) {
    console.log('目标路径不存在或者不是文件夹');
    return;
  }
//  console.log("__dirname:"+basePath);
//  return;
  const nameArr=arr2;
  const jsonPath=path.join('D:/_ProfessionalSkill/CocosProject/my-tools/output-paths.json');
  // 读取json文件
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  // console.log("jsonContent:"+jsonContent);return;
  // 解析JSON
  const jsonObj =JSON.parse(jsonContent);

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
  const targetDir = path.join(sourceDir, name);
  const fileName = path.basename(sourcePath);
  console.log(`sourceDir: ${sourceDir}, targetDir: ${targetDir}, fileName: ${fileName}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  fs.renameSync(sourcePath, path.join(targetDir, fileName));
  return targetDir;
}