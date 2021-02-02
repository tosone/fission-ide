import * as path from 'path';

import axios from 'axios';
import * as vscode from 'vscode';

import config from "../config";

export class FunctionProvider implements vscode.TreeDataProvider<FissionFunction>{
  private _onDidChangeTreeData: vscode.EventEmitter<FissionFunction | undefined | void> = new vscode.EventEmitter<FissionFunction | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<FissionFunction | undefined | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FissionFunction): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FissionFunction): Thenable<FissionFunction[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.getFunction());
    }
  }

  async getFunction(): Promise<FissionFunction[]> {
    const resp = await axios.get(config.get().UrlFunctions);
    return resp.data?.map((element: { metadata: { name: string; }; }) => {
      return new FissionFunction(element?.metadata?.name,
        "nodejs",
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'extension.openPackageOnNpm',
          title: 'ssss',
          arguments: []
        });
    });
  }
}

export class FissionFunction extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(name, collapsibleState);
    this.tooltip = `${this.name}-${this.version}`;
    this.description = this.name;
  }

  iconPath = path.join(__filename, '..', '..', 'resources', 'dependency.svg');

  contextValue = 'functions';
}
