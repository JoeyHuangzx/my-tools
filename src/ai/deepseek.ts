import OpenAI from "openai";

const openai = new OpenAI({baseURL:'https://api.deepseek.com', apiKey:'sk-3c773197dbaf42248413ffb94515b89d' });
// console.log(process.env.OPENAI_API_KEY);
const model = "deepseek-chat";

export async function askDeepseek(query: string) {
  console.log("Asking Deepseek...");
  
  const response = await openai.chat.completions.create({
    model,
    messages:[{content: query, role: "system"}],
  });
  console.log(response.choices[0].message.content);
}