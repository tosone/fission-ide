import * as vscode from 'vscode';
import { FissionFunctionProvider } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';

export function activate(context: vscode.ExtensionContext) {
    const fissionFunctionProvider = new FissionFunctionProvider();
    vscode.window.registerTreeDataProvider('fission-function', fissionFunctionProvider);

    const fissionPackageProvider = new FissionPackageProvider();
    vscode.window.registerTreeDataProvider('fission-package', fissionPackageProvider);

    const fissionEnvironmentProvider = new FissionEnvironmentProvider();
    vscode.window.registerTreeDataProvider('fission-environment', fissionEnvironmentProvider);

    let disposable = vscode.commands.registerCommand('fission-ide.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from fission-ide!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
