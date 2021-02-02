import * as path from 'path';

import * as vscode from 'vscode';

import config from "./lib/config";
import packages from './lib/packages';
import functions from './lib/functions';
import environents from './lib/environents';

import ViewDeploy from './view/functionDeploy/deploy';

const FissionConfig = ".fission.json";

export function activate(context: vscode.ExtensionContext) {
  const functionProvider = new functions.FunctionProvider();
  vscode.window.registerTreeDataProvider('fission-function', functionProvider);

  const packageProvider = new packages.PackageProvider();
  vscode.window.registerTreeDataProvider('fission-package', packageProvider);

  const environmentProvider = new environents.EnvironmentProvider();
  vscode.window.registerTreeDataProvider('fission-environment', environmentProvider);

  vscode.commands.registerCommand('fission-ide.function.delete', (node: any) => {
    functions.del(node.label);
    functionProvider.refresh();
  });

  vscode.commands.registerCommand('fission-ide.package.delete', (node: any) => {
    packages.del(node.label);
    packageProvider.refresh();
  });

  vscode.commands.registerCommand('fission-ide.environment.delete', (node: any) => {
    environents.del(node.label);
    environmentProvider.refresh();
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
    functionProvider.refresh();
  }));
  let PackageRefreshCommand = "fission-ide.package.refresh";
  context.subscriptions.push(vscode.commands.registerCommand(PackageRefreshCommand, () => {
    packageProvider.refresh();
  }));
  let EnvironmentRefreshCommand = "fission-ide.environment.refresh";
  context.subscriptions.push(vscode.commands.registerCommand(EnvironmentRefreshCommand, () => {
    environmentProvider.refresh();
  }));

  // TODO: function dir deploy
  let deployStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  deployStatusBarItem.command = DeployCommand;
  deployStatusBarItem.text = "$(cloud-upload) Deploy function";
  context.subscriptions.push(deployStatusBarItem);
  deployStatusBarItem.show();
}

export function deactivate() { }
