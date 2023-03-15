import axios from "axios";
import {
  OpenAIChatCompletionPayload,
  OpenAICompletionPayload,
  OpenAIEditPayload,
  OpenAIResponse,
} from "../types";

const DEFAULT_COMPLETION_API_ENDPOINT = "https://api.openai.com/v1/completions";

const MAP_MODEL_COMPLETION_ENDPOINTS = {
  "gpt-3.5-turbo": "https://api.openai.com/v1/chat/completions",
};

export const formatPayload = (
  model: string,
  max_tokens: number,
  temperature: number,
  prompt: string
): OpenAICompletionPayload | OpenAIChatCompletionPayload => {
  let payload: OpenAICompletionPayload | OpenAIChatCompletionPayload;

  if (["gpt-3.5-turbo"].includes(model)) {
    payload = {
      max_tokens,
      model,
      temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };
  } else {
    payload = {
      max_tokens,
      model,
      temperature,
      prompt,
    };
  }

  return payload;
};

export const getCompletion = async (
  model: string,
  apikey: string,
  payload: OpenAICompletionPayload | OpenAIChatCompletionPayload
): Promise<OpenAIResponse> => {
  const response = await axios.post(
    // @ts-ignore
    MAP_MODEL_COMPLETION_ENDPOINTS[model] || DEFAULT_COMPLETION_API_ENDPOINT,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey,
      },
    }
  );

  return response.data;
};

export const getEdit = async (
  apikey: string,
  payload: OpenAIEditPayload
): Promise<OpenAIResponse> => {
  const response = await axios.post(
    "https://api.openai.com/v1/edits",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey,
      },
    }
  );

  return response.data;
};
