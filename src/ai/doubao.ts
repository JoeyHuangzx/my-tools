import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export async function askDoubao(query: string) {
  console.log('Asking Doubao...');
  const openai = new OpenAI({
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: process.env.OPENAI_DOUBAO_API_KEY,
  });
  const model = 'ep-20250210214112-2wldn';
  const stream = await openai.chat.completions.create({
    model,
    messages: [{ content: query, role: 'user' }],
    stream: true,
  });
  // 提取回复内容
  // const outputContent = stream.choices[0].message.content || '';
   // 处理问题，使其成为合法的文件名
   const sanitizedQuestion = query.replace(/[\\/*?:"<>|]/g, '');
   const fileName = `ASK/doubao-${sanitizedQuestion}.md`;

   // 定义要写入的文件路径
  //  const filePath = path.join(__dirname, fileName);

   // 将内容写入文件
  //  fs.writeFile(filePath, JSON.stringify(content,null,2), 'utf8', (err) => {
  //      if (err) {
  //          console.error('写入文件时出错:', err);
  //      } else {
  //          console.log(`内容已成功写入 ${fileName} 文件`);
  //      }
  //  });
  
  // 逐行写入文件
  const lines:string[] = [];
  const writeStream=fs.createWriteStream(fileName,'utf-8');
  writeStream.write('## '+sanitizedQuestion+'\n');
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
    lines.push(part.choices[0]?.delta?.content || '');
    writeStream.write(part.choices[0]?.delta?.content || '');
  }
  writeStream.end();
  process.stdout.write('\n');
  console.log('结束====');
}
