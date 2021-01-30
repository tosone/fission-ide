import * as path from 'path';

import * as vscode from 'vscode';

import { FissionFunctionProvider, FissionFunction } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';

import * as FunctionDeploy from "./commands/functions/deploy";
import Delete from './commands/functions/delete';
import ViewLoader from './view/deploy';

const FissionConfig = ".fission.json";

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

    let DeployCommand = "fission-ide.deploy";
    context.subscriptions.push(vscode.commands.registerCommand(DeployCommand, (uri: vscode.Uri) => {
        if (uri == undefined) {
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                let rootFolder = vscode.workspace.workspaceFolders[0];
                let config = path.join(rootFolder.uri.fsPath, FissionConfig);
                new ViewLoader(context.extensionPath, config);
            } else {
                vscode.window.showInformationMessage("Cannot find valid directory");
            }
        } else {
            let rootFolder = path.dirname(uri.fsPath);
            let config = path.join(rootFolder, FissionConfig);
            new ViewLoader(context.extensionPath, config);
        }
    }))

    let DeployNewDeployCommand = "fission-ide.deploy.newdeploy";
    let deployNewDeploy = vscode.commands.registerCommand(DeployNewDeployCommand, () => {
        if (vscode.workspace.workspaceFolders?.length == 1) {
            return FunctionDeploy.Deploy(vscode.workspace.workspaceFolders[0].uri.path);
        }
    });
    context.subscriptions.push(deployNewDeploy);

    let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    deployStatusBarItem.command = DeployCommand;
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
