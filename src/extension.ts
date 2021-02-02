import * as path from 'path';

import * as vscode from 'vscode';

import { FissionFunctionProvider, FissionFunction } from './functions';
import { FissionPackageProvider } from './packages';
import { FissionEnvironmentProvider } from './environments';
import functions from './lib/functions';
import ViewDeploy from './view/functionDeploy/deploy';
import config from "./lib/config";
import packages from './lib/packages';
import environents from './lib/environents';

const FissionConfig = ".fission.json";

export function activate(context: vscode.ExtensionContext) {
  const fissionFunctionProvider = new FissionFunctionProvider();
  vscode.window.registerTreeDataProvider('fission-function', fissionFunctionProvider);

  const fissionPackageProvider = new FissionPackageProvider();
  vscode.window.registerTreeDataProvider('fission-package', fissionPackageProvider);

  const fissionEnvironmentProvider = new FissionEnvironmentProvider();
  vscode.window.registerTreeDataProvider('fission-environment', fissionEnvironmentProvider);

  vscode.commands.registerCommand('fission-ide.function.delete', (node: FissionFunction) => {
    functions.del(node.label);
    fissionFunctionProvider.refresh();
  });

  vscode.commands.registerCommand('fission-ide.package.delete', (node: FissionFunction) => {
    packages.del(node.label);
    fissionPackageProvider.refresh();
  });

  vscode.commands.registerCommand('fission-ide.environment.delete', (node: FissionFunction) => {
    environents.del(node.label);
    fissionEnvironmentProvider.refresh();
  });

  let DeployCommand = "fission-ide.function.deploy";
  context.subscriptions.push(vscode.commands.registerCommand(DeployCommand, (uri: vscode.Uri) => {
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
  }));

  let ConfigUpdateCommand = "fission-ide.config.update";
  context.subscriptions.push(vscode.commands.registerCommand(ConfigUpdateCommand, () => {
    let options: vscode.InputBoxOptions = {
      prompt: "Fission controller server address"
    };
    vscode.window.showInputBox(options).then((val: string | undefined) => {
      if (val == undefined) {
        return;
      }
      if (val === "") {
        vscode.window.showErrorMessage("Invalid server address");
        return;
      }
      config.test(val).then(avaliable => {
        if (!avaliable) {
          vscode.window.showErrorMessage("Cannot connect the fission server, please check");
        } else {
          config.update(val);
          vscode.window.showInformationMessage("Server address has been set");
        }
      })
    });
  }));

  let FunctionRefreshCommand = "fission-ide.function.refresh";
  context.subscriptions.push(vscode.commands.registerCommand(FunctionRefreshCommand, () => {
    fissionFunctionProvider.refresh();
  }));
  let PackageRefreshCommand = "fission-ide.package.refresh";
  context.subscriptions.push(vscode.commands.registerCommand(PackageRefreshCommand, () => {
    fissionPackageProvider.refresh();
  }));
  let EnvironmentRefreshCommand = "fission-ide.environment.refresh";
  context.subscriptions.push(vscode.commands.registerCommand(EnvironmentRefreshCommand, () => {
    fissionEnvironmentProvider.refresh();
  }));

  // TODO: function dir deploy
  let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  deployStatusBarItem.command = DeployCommand;
  deployStatusBarItem.text = "$(cloud-upload) Deploy function";
  context.subscriptions.push(deployStatusBarItem);
  deployStatusBarItem.show();
}

export function deactivate() { }
