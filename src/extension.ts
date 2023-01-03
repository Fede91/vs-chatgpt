import * as vscode from "vscode";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("OpenAI");

  let disposable = vscode.commands.registerCommand(
    "vs-chatgpt.completions",
    async () => {
      const config = vscode.workspace.getConfiguration("vs-chatgpt");
      const apikey: string | undefined = config.get("apikey");
      const model: string | undefined = config.get("model");
      const maxTokens: string | undefined = config.get("max_tokens");

      if (!apikey || (apikey && apikey.length === 0)) {
        return vscode.window.showErrorMessage(
          "You must add the OpenAI secret API key!"
        );
      }

      if (!model || (model && model.length === 0)) {
        return vscode.window.showErrorMessage("You must set a model!");
      }

      if (!maxTokens || (maxTokens && Number(maxTokens) === 0)) {
        return vscode.window.showErrorMessage(
          "You must set the maximum number of tokens!"
        );
      }

      const inputText = await vscode.window.showInputBox({
        value: "",
        placeHolder: "Write your text...",
        validateInput: (text) => {
          return (text || "").length === 0 ? "Write a message!" : null;
        },
      });

      if ((inputText || "").length === 0) {
        return;
      }

      outputChannel.appendLine(
        "------------------------------------------------------------"
      );
      outputChannel.appendLine("INPUT: " + inputText);
      outputChannel.show();

      try {
        const data = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Thinking...",
          },
          async () => {
            const payload = {
              model,
              prompt: inputText,
              max_tokens: Number(maxTokens),
              temperature: 0,
            };

            console.log(payload);

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
          }
        );

        const choice = data.choices[0];
        outputChannel.appendLine(choice.text);
      } catch (err: any) {
        console.error(err);

        if (err.response.status === 401) {
          vscode.window.showErrorMessage("Invalid API Key");
        } else {
          vscode.window.showErrorMessage("Something went wrong.");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
