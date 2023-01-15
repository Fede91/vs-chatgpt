import * as vscode from "vscode";
import { getCompletion } from "./libs/openai";
import strings from "./config/strings";

import {
  getConfig,
  getSelectedText,
  handleErrors,
  showNewPrompt,
} from "./libs/plugin";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("OpenAI");

  let disposableCompletions = vscode.commands.registerCommand(
    "vs-chatgpt.completions",
    async () => {
      try {
        const { apikey, maxTokens, model } = getConfig();

        const defaultValue = getSelectedText();

        const inputText = await vscode.window.showInputBox({
          value: defaultValue,
          placeHolder: "Write your text...",
          validateInput: (text) => {
            return (text || "").length === 0 ? "Write a message!" : null;
          },
        });

        if ((inputText || "").length === 0) {
          return;
        }

        showNewPrompt(outputChannel, String(inputText));

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = {
              model,
              prompt: String(inputText),
              max_tokens: Number(maxTokens),
              temperature: 0,
            };

            return await getCompletion(apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(choice.text);
      } catch (err: any) {
        handleErrors(err);
      }
    }
  );

  let disposableExplainRegex = vscode.commands.registerCommand(
    "vs-chatgpt.explain_regex",
    async () => {
      try {
        const { apikey, maxTokens, model, explainRegexCmd } = getConfig();

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          throw new Error("You must highlight the regular expression!");
        }

        const prompt = `${explainRegexCmd}

${selectedText}`;

        showNewPrompt(outputChannel, prompt);

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = {
              model,
              prompt,
              max_tokens: Number(maxTokens),
              temperature: 0,
            };

            return await getCompletion(apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(choice.text);
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  let disposableExplainSnippet = vscode.commands.registerCommand(
    "vs-chatgpt.explain_code",
    async () => {
      try {
        const { apikey, maxTokens, model, explainCodeSnippetCmd } = getConfig();

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          throw new Error("You must highlight the regular expression!");
        }

        const prompt = `${explainCodeSnippetCmd}

${selectedText}`;

        showNewPrompt(outputChannel, prompt);

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = {
              model,
              prompt,
              max_tokens: Number(maxTokens),
              temperature: 0,
            };

            return await getCompletion(apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(choice.text);
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  context.subscriptions.push(disposableCompletions);
  context.subscriptions.push(disposableExplainRegex);
  context.subscriptions.push(disposableExplainSnippet);
}

export function deactivate() {}
