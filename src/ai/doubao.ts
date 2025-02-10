import OpenAI from "openai";

const openai = new OpenAI({baseURL:'https://ark.cn-beijing.volces.com/api/v3', apiKey:'0f12069c-ef87-4b61-89e1-1342d49d2391' });
// console.log(process.env.OPENAI_DOUBAO_API_KEY);
const model = "ep-20250210214112-2wldn";

export async function askDoubao(query: string) {
  console.log("Asking Doubao...");
  
  const response = await openai.chat.completions.create({
    model,
    messages:[{content: query, role: "user"}],
    
  });
  console.log(response.choices[0].message.content);
}