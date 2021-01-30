import * as path from 'path';

import * as vscode from 'vscode';

import { FissionFunctionProvider, FissionFunction } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';

import Delete from './commands/functions/delete';

import ViewDeploy from './view/functionDeploy/deploy';

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
        console.log(vscode.workspace.getConfiguration("fission").get("server"));
        if (uri == undefined) {
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                let rootFolder = vscode.workspace.workspaceFolders[0];
                let config = path.join(rootFolder.uri.fsPath, FissionConfig);
                new ViewDeploy(context.extensionPath, rootFolder.uri.fsPath, config);
            } else {
                vscode.window.showErrorMessage("Cannot find valid directory");
            }
        } else {
            let rootFolder = path.dirname(uri.fsPath);
            let config = path.join(rootFolder, FissionConfig);
            new ViewDeploy(context.extensionPath, uri.fsPath, config);
        }
    }))

    let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    deployStatusBarItem.command = DeployCommand;
    deployStatusBarItem.text = "$(cloud-upload) Deploy function";
    context.subscriptions.push(deployStatusBarItem);
    deployStatusBarItem.show();
}

export function deactivate() { }
