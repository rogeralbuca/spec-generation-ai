// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Result } from './models/response.model';
import { getPrompt } from './prompts/prompts';

const HOST: string = 'localhost';
const PORT: string = '1234';
const API: string = 'v1/chat/completions';
const MODEL: string = 'LM Studio Community/Meta-Llama-3-8B-Instruct-GGUF';
const COMMAND: string = 'spec-generation-ai.generate';

let statusBarItem: vscode.StatusBarItem;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// create a new status bar item that we can now manage
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = COMMAND;
	context.subscriptions.push(statusBarItem);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND, async () => {
		try {

			updateStatusBarItem(true);

			const codeToAnalyze = await getActiveEditorContent();

			const response = await fetch(`http://${HOST}:${PORT}/${API}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					model: MODEL,
					messages: [
						{
							role: "system",
							content: getPrompt('system')
						},
						{
							role: "user",
							content: getPrompt('user')
						},
						{
							role: "user",
							content: codeToAnalyze
						}
					],
					temperature: 1,
					max_tokens: -1,
					stream: false
				})
			});

			if (!response.ok) {
				throw new Error(`Error executing command: ${response.status}`);
			}

			const result = await response.json() as Result;

			if (result && result.choices[0]) {
				// Use the console to output diagnostic information (console.log) and errors (console.error)
				// This line of code will only be executed once when your extension is activated
				const specCode = result.choices[0].message.content;

				const newUri = generateNewFileUri();
				if (!newUri) {
					throw new Error('Unable to generate new file name.');
				}

				// Create a new file physically on the file system
				fs.writeFileSync(newUri.fsPath, specCode);

				// Open the new file in the editor
				const newDocument = await vscode.workspace.openTextDocument(newUri);
				await vscode.window.showTextDocument(newDocument);
				

				// The code you place here will be executed every time your command is executed
				// Display a message box to the user
				vscode.window.showInformationMessage('Test file created successfully!');

				updateStatusBarItem(false);
			}
		} catch (error) {
			console.error(`Error executing command: ${error}`);
		}
	}));
}

// This method is called to fetch the contents of the html or typescript file
async function getActiveEditorContent(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		if (document.languageId === 'html' || document.languageId === 'typescript') {
			return document.getText();
		} else {
			vscode.window.showInformationMessage('The opened file is not HTML or TypeScript.');
		}
	} else {
		vscode.window.showInformationMessage('Open an HTML or TypeScript file.');
	}
	return undefined;
}

// This method is called when a new file is generated
function generateNewFileUri(): vscode.Uri | undefined {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const originalPath = document.uri.fsPath;
		const newPath = originalPath.replace(/(\.html|\.ts)$/, '.spec.ts');
		return vscode.Uri.file(newPath);
	}
	return undefined;
}

function updateStatusBarItem(show: boolean): void {
	if (show) {
		statusBarItem.text = `$(loading~spin) Generating test file`;
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}

function extractCodeBlocks(code: string, language: string) {
    const regex = new RegExp(`\`\`\`${language}[\\s\\S]*?\`\`\``, 'g');
    const codeBlocks = code.match(regex);
    return codeBlocks ? codeBlocks.join('\n') : '';
}

// This method is called when your extension is deactivated
export function deactivate() { }
