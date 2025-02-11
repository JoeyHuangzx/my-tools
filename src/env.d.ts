declare namespace NodeJS {
  interface ProcessEnv {
      CHATGPT_API_KEY: string;
      OPENAI_API_KEY: string;
      OPENAI_DOUBAO_API_KEY: string;
      // 如果你还有其他环境变量，也可以在这里添加
      // ANOTHER_ENV_VARIABLE: string;
  }
}