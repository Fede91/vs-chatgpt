import * as vscode from "vscode";
import { Config } from "../types";

export const getConfig = (): Config => {
  const config = vscode.workspace.getConfiguration("vs-chatgpt");
  const apikey: string | undefined = config.get("apikey");
  const model: string | undefined = config.get("model");
  const maxTokens: string | undefined = config.get("max_tokens");
  const explainRegexCmd: string | undefined = config.get("explain_regex_cmd");
  const explainCodeSnippetCmd: string | undefined = config.get(
    "explain_code_snippet_cmd"
  );

  if (!apikey || (apikey && apikey.length === 0)) {
    throw new Error("You must add the OpenAI secret API key!");
  }

  if (!model || (model && model.length === 0)) {
    throw new Error("You must set a model!");
  }

  if (!maxTokens || (maxTokens && Number(maxTokens) === 0)) {
    throw new Error("You must set the maximum number of tokens!");
  }

  if (!explainRegexCmd || (explainRegexCmd && explainRegexCmd.length === 0)) {
    throw new Error("You must set a regular expression command!");
  }

  if (
    !explainCodeSnippetCmd ||
    (explainCodeSnippetCmd && explainCodeSnippetCmd.length === 0)
  ) {
    throw new Error("You must set an explain code snippet command!");
  }

  return {
    apikey,
    model,
    maxTokens,
    explainRegexCmd,
    explainCodeSnippetCmd,
  };
};

export const getSelectedText = (): string => {
  let text = "";
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    // Text editor is opened
    const selection = editor.selection;

    text = editor.document.getText(selection);
  }

  return text;
};

export const handleErrors = (err: any) => {
  console.error(err);

  if (err.response?.status === 401) {
    vscode.window.showErrorMessage("Invalid API Key");
  } else {
    vscode.window.showErrorMessage(err.message);
  }
};

export const showNewPrompt = (
  outputChannel: vscode.OutputChannel,
  prompt: string
) => {
  outputChannel.appendLine(
    "------------------------------------------------------------"
  );
  outputChannel.appendLine("INPUT: " + prompt);
  outputChannel.show();
};
