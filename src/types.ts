export type Config = {
  apikey: string;
  model: string;
  maxTokens: string;
  explainRegexCmd: string;
  explainCodeSnippetCmd: string;
  generateUnitTestCmd: string;
};

export type OpenAIPayload = {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
};

export type OpenAIResponse = {
  id: string;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: 152;
  };
  created: number;
  choices: {
    text: string;
    finish_reason: string;
    index: number;
    logprobs: string | null;
  }[];
};
