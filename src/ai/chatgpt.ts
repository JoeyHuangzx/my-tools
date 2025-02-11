import OpenAI from 'openai';

// 被限制了，暂时不可用
// 429 - You exceeded your current quota, please check your plan and billing details
// 429 - 您超出了当前配额，请检查您的计划和账单详细信息
const openai = new OpenAI({
  apiKey:process.env.CHATGPT_API_KEY
    
});
// console.log(process.env.OPENAI_DOUBAO_API_KEY);
const model = 'gpt-4o-mini';

export async function askChatgpt(query: string) {
  console.log('Asking chatgpt...');
  const stream = await openai.chat.completions.create({
    model,
    messages: [{ content: query, role: 'user' }],
    stream: true,
  });
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
  }
  process.stdout.write('\n');
}
