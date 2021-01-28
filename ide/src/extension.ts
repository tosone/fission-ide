import * as vscode from 'vscode';

import { FissionFunctionProvider, FissionFunction } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';

import Deploy from "./commands/functions/deploy";
import Delete from './commands/functions/delete';
import ViewLoader from './view/ViewLoader';

export function activate(context: vscode.ExtensionContext) {
    const fissionFunctionProvider = new FissionFunctionProvider();
    vscode.window.registerTreeDataProvider('fission-function', fissionFunctionProvider);

    const fissionPackageProvider = new FissionPackageProvider();
    vscode.window.registerTreeDataProvider('fission-package', fissionPackageProvider);

    const fissionEnvironmentProvider = new FissionEnvironmentProvider();
    vscode.window.registerTreeDataProvider('fission-environment', fissionEnvironmentProvider);

    vscode.commands.registerCommand('fission-ide.function.delete', (node: FissionFunction) => {
        Delete(node.label);
        fissionFunctionProvider.refresh();
    });

    let helloCommand = "fission-ide.deploy";
    let disposable = vscode.commands.registerCommand(helloCommand, () => {
        if (vscode.workspace.workspaceFolders?.length == 1) {
            return Deploy(vscode.workspace.workspaceFolders[0].uri.path);
        }
    });
    context.subscriptions.push(disposable);

    let DeployPoolMgrCommand = "fission-ide.deploy.poolmgr";
    let deployPoolMgr = vscode.commands.registerCommand(DeployPoolMgrCommand, () => {
        let uri = vscode.Uri.file("/Users/tosone/go/src/github.com/fission/reactception/Step 6/config.json");
        new ViewLoader(uri, context.extensionPath);
        // const panel = vscode.window.createWebviewPanel(
        //     'catCoding', // Identifies the type of the webview. Used internally
        //     'Cat Coding', // Title of the panel displayed to the user
        //     vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        //     {} // Webview options. More on these later.
        // );
        // panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(deployPoolMgr);

    let DeployNewDeployCommand = "fission-ide.deploy.newdeploy";
    let deployNewDeploy = vscode.commands.registerCommand(DeployNewDeployCommand, () => {
        if (vscode.workspace.workspaceFolders?.length == 1) {
            return Deploy(vscode.workspace.workspaceFolders[0].uri.path);
        }
    });
    context.subscriptions.push(deployNewDeploy);

    let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    deployStatusBarItem.command = helloCommand;
    deployStatusBarItem.text = "Deploy function";
    context.subscriptions.push(deployStatusBarItem);
    deployStatusBarItem.show();
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
</body>
</html>`;
}

export function deactivate() { }
