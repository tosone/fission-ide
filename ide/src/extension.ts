import * as vscode from 'vscode';

import { FissionFunctionProvider, FissionFunction } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';

import Deploy from "./commands/functions/deploy";
import Delete from './commands/functions/delete';

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

    let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    deployStatusBarItem.command = helloCommand;
    deployStatusBarItem.text = "Deploy function";
    context.subscriptions.push(deployStatusBarItem);
    deployStatusBarItem.show();

    context.subscriptions.push(disposable);
}

export function deactivate() { }
