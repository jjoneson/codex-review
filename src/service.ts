// This class manages integration with the OpenAPI Codex API, specifically, the edit endpoint
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";

export class CodexService {
    private openai: OpenAIApi;
    private _model: string = "code-davinci-edit-001";

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORGANIZATION,

        });

        this.openai = new OpenAIApi(configuration);
    }

    // Set the API key to use for the OpenAI Codex API
    public setApiKey(apiKey: string): void {
        const configuration = new Configuration({
            apiKey: apiKey,
        });

        this.openai = new OpenAIApi(configuration);
    }

    public async edit(text: string, intent: string): Promise<string[]> {
        const response = await this.openai.createEdit({
            model: this._model,
                instruction: intent,
                input: text,        
        });

        return response.data.choices.map((choice) => choice.text ?? "");
    }

    // Create a panel with selectable refactorings for the user to choose from using the vscode extension api
    public async createRefactorPanel(text: string, intent: string): Promise<void> {
        const refactorings = await this.edit(text, intent);
        const panel = vscode.window.createWebviewPanel(
            "codexReview.refactor",
            "Refactor",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );

        panel.webview.html = this.getWebviewContent(refactorings);
    }

    private getWebviewContent(refactorings: string[]): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Codex Review</title>
        </head>
        <body>
            <h1>Refactor</h1>
            <ul>
                ${refactorings.map((refactoring) => `<li>${refactoring}</li>`).join("")}
            </ul>
        </body>
        </html>
        `;
    }

    // Simple method to get the first refactor suggestion from the API
    public async getRefactor(text: string, intent: string): Promise<string> {
        const refactorings = await this.edit(text, intent);
        return refactorings[0];
    }


}



