import axios from "axios";
import {
  OpenAICompletionPayload,
  OpenAIEditPayload,
  OpenAIResponse,
} from "../types";

export const getCompletion = async (
  apikey: string,
  payload: OpenAICompletionPayload
): Promise<OpenAIResponse> => {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
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
