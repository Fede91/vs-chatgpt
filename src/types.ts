export type Config = {
  apikey: string;
  model: string;
  maxTokens: string;
  explainRegexCmd: string;
  explainCodeSnippetCmd: string;
  generateUnitTestCmd: string;
  commentCodeCmd: string;
  generateJSDocCmd: string;
};

export type OpenAICompletionPayload = {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
};

export type OpenAIChatCompletionPayload = {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens: number;
  temperature: number;
};

export type OpenAIEditPayload = {
  model: string;
  input: string;
  temperature: number;
  instruction: string;
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
    text?: string;
    message?: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
    logprobs?: string | null;
  }[];
};
