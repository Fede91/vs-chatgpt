import axios from "axios";
import { OpenAIPayload, OpenAIResponse } from "../types";

export const getCompletion = async (
  apikey: string,
  payload: OpenAIPayload
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
