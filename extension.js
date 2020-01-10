// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cr" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.ConditionalSearchReplace', function () {
		// The code you place here will be executed every time your command is executed
		condReplace()
	});

	context.subscriptions.push(disposable);

}
exports.activate = activate;

// Conditional Search&Replace Algorithm
async function condReplace(){

	//Display inputBoxes
	var conditionalPattern;
	conditionalPattern = await vscode.window.showInputBox({ prompt: 'Provide a search pattern with which the line should start' });

	var searchPattern
	searchPattern = await vscode.window.showInputBox({ prompt: 'Provide a search pattern' });

	var replacePattern
	replacePattern = await vscode.window.showInputBox({ prompt: 'Provide a replace pattern' });

	vscode.window.showInformationMessage('Finished Conditional Search&Replace');

	//Reading the currently open text line by line and replace if necessary

	//get Object of active Editor
	let activeEditor = vscode.window.activeTextEditor;
	var strALLLines = "";

	if (!activeEditor) {
		return;
		}	

	//Reading the currently open text line by line
	const { activeTextEditor } = vscode.window;
	const { document } = activeTextEditor;
	let editor = vscode.window.activeTextEditor;

	//Setting Range of whole document
	var completeRange = new vscode.Range(0,0,(document.lineCount-1),activeEditor.document.lineAt((document.lineCount-1)).range.end.character);

	//loop over all Lines
	for (var i = 0; i < document.lineCount;i++){
		//create selection of whole line
		var currentRange = activeEditor.document.lineAt(i).range;
		var strSelectedLine =  activeEditor.document.getText(currentRange);
		var strNewLine = strSelectedLine;

		//Check if the conditional Pattern is met and perform search&Replace in that case
		if (strSelectedLine.startsWith(conditionalPattern)){
			strNewLine = strSelectedLine.replace(searchPattern,replacePattern);
		}
		
		//Building a String containing all Altered Lines
		if (strALLLines==""){
			//First Line
			strALLLines=strNewLine
		}else
		{
			//All following Lines
			strALLLines = strALLLines + "\n" + strNewLine;
		}
	}
	activeEditor.edit(builder => builder.replace(completeRange, strALLLines))
  }

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
