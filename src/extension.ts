import * as vscode from "vscode";
import { formatPayload, getCompletion, getEdit } from "./libs/openai";
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
            const payload = formatPayload(
              model,
              Number(maxTokens),
              0,
              String(inputText)
            );

            return await getCompletion(model, apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(
          String(choice.text || choice.message?.content)
        );
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
            const payload = formatPayload(model, Number(maxTokens), 0, prompt);

            return await getCompletion(model, apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(
          String(choice.text || choice.message?.content)
        );
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
          throw new Error("You must highlight the code snippet!");
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
            const payload = formatPayload(model, Number(maxTokens), 0, prompt);

            return await getCompletion(model, apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(
          String(choice.text || choice.message?.content)
        );
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  let disposableGenerateUnitTests = vscode.commands.registerCommand(
    "vs-chatgpt.generate_unit_tests",
    async () => {
      try {
        const { apikey, maxTokens, model, generateUnitTestCmd } = getConfig();

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          throw new Error("You must highlight the code snippet!");
        }

        const prompt = `${generateUnitTestCmd}

${selectedText}`;

        showNewPrompt(outputChannel, prompt);

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = formatPayload(model, Number(maxTokens), 0, prompt);

            return await getCompletion(model, apikey, payload);
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(
          String(choice.text || choice.message?.content)
        );
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  let disposableAddComments = vscode.commands.registerCommand(
    "vs-chatgpt.comment_code",
    async () => {
      try {
        const { apikey, maxTokens, model, commentCodeCmd } = getConfig();

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          throw new Error("You must highlight the code snippet!");
        }

        const prompt = `${commentCodeCmd}

${selectedText}`;

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = {
              model: "text-davinci-edit-001",
              input: selectedText,
              instruction: commentCodeCmd,
              temperature: 0,
            };

            return await getEdit(apikey, payload);
          }
        );

        const choice = data.choices[0];

        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.active) {
          editor.edit((editBuilder) => {
            editBuilder.replace(
              editor.selection,
              String(choice.text || choice.message?.content)
            );
          });
        } else {
          showNewPrompt(outputChannel, prompt);
          outputChannel.appendLine(
            String(choice.text || choice.message?.content)
          );
        }
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  let disposableGenerateJSDoc = vscode.commands.registerCommand(
    "vs-chatgpt.generate_jsdoc",
    async () => {
      try {
        const { apikey, maxTokens, model, generateJSDocCmd } = getConfig();

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          throw new Error("You must highlight the code snippet!");
        }

        const prompt = `${generateJSDocCmd}

${selectedText}`;

        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: strings.NOTIFICATION_TITLE,
          },
          async () => {
            const payload = formatPayload(model, Number(maxTokens), 0, prompt);

            return await getCompletion(model, apikey, payload);
          }
        );

        const choice = data.choices[0];

        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.active) {
          editor.edit((editBuilder) => {
            const position =
              editor.selection.active.line < editor.selection.anchor.line
                ? editor.selection.active
                : editor.selection.anchor;
            editBuilder.insert(
              position,
              String(choice.text || choice.message?.content) + "\n"
            );
          });
        } else {
          showNewPrompt(outputChannel, prompt);
          outputChannel.appendLine(
            String(choice.text || choice.message?.content)
          );
        }
      } catch (err) {
        handleErrors(err);
      }
    }
  );

  context.subscriptions.push(disposableCompletions);
  context.subscriptions.push(disposableExplainRegex);
  context.subscriptions.push(disposableExplainSnippet);
  context.subscriptions.push(disposableGenerateUnitTests);
  context.subscriptions.push(disposableAddComments);
  context.subscriptions.push(disposableGenerateJSDoc);
}

export function deactivate() {}
