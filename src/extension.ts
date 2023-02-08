// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodexService } from "./service";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// Create an instance of the CodexService class
const _codexService = new CodexService();

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('codex-review.refactor', () => {
		var refactorIntent = vscode.window.showInputBox({
			placeHolder: "How do you want this to be refactored?",
			prompt: "Enter a refactoring intent",
			ignoreFocusOut: true,
		});


		refactorIntent.then((value) => {
			if (value) {
				var editor = vscode.window.activeTextEditor;
				if (!editor) {
					return;
				}
				var text = editor.document.getText(editor.selection);
				_codexService.getRefactor(text, value).then((refactor) => {
					var editor = vscode.window.activeTextEditor;
					if (!editor) {
						return;
					}
					editor.edit((editBuilder) => {
						editBuilder.replace(editor!.selection, refactor);
					});
				});				
			}
		});
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
