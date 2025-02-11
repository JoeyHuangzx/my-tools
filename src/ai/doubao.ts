import OpenAI from 'openai';

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
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
  }
  process.stdout.write('\n');
}
