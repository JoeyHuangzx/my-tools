import OpenAI from 'openai';

export async function askDeepseek(query: string) {
  console.log('Asking Deepseek...');
  const openai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: process.env.OPENAI_API_KEY });
  // console.log(process.env.OPENAI_API_KEY);
  const model = 'deepseek-chat';

  const response = await openai.chat.completions.create({
    model,
    messages: [{ content: query, role: 'system' }],
  });
  console.log(response.choices[0].message.content);
}
