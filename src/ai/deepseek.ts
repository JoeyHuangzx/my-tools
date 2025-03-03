import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export enum DeepseekModel {
  Reasoner = 'deepseek-reasoner',
  Chat= 'deepseek-chat',
}

export async function askDeepseek(query: string) {
  console.log('Asking Deepseek...');
  const openai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: process.env.OPENAI_API_KEY });
  // console.log(process.env.OPENAI_API_KEY);
  const model = 'deepseek-reasoner';
  // 处理问题，使其成为合法的文件名
  const sanitizedQuestion = query.replace(/[\\/*?:"<>|]/g, '');
  const fileName = `ASK/deepseek-${sanitizedQuestion}.md`;

  // 定义要写入的文件路径
  //  const filePath = path.join(__dirname, fileName);

  const response = await openai.chat.completions.create({
    stream: true,
    model,
    messages: [{ content: query, role: 'user' }],
  });
  const lines: string[] = [];
  const writeStream = fs.createWriteStream(fileName, 'utf-8');
  writeStream.write('## ' + sanitizedQuestion + '\n');
  for await (const part of response) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
    lines.push(part.choices[0]?.delta?.content || '');
    writeStream.write(part.choices[0]?.delta?.content || '');
  }
  writeStream.end();
  process.stdout.write('\n');
  console.log('结束====');
}
