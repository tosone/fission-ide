import * as path from 'path';

import * as vscode from 'vscode';
import axios from 'axios';

import config from "../config";

export class EnvironmentProvider implements vscode.TreeDataProvider<FissionEnvironment>{
  private _onDidChangeTreeData: vscode.EventEmitter<FissionEnvironment | undefined | void> = new vscode.EventEmitter<FissionEnvironment | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<FissionEnvironment | undefined | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FissionEnvironment): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FissionEnvironment): Thenable<FissionEnvironment[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.getFunction());
    }
  }

  async getFunction(): Promise<FissionEnvironment[]> {
    const resp = await axios.get(config.get().UrlEnvironments);
    return resp.data?.map((element: { metadata: { name: string; }; }) => {
      return new FissionEnvironment(element?.metadata?.name, "nodejs", vscode.TreeItemCollapsibleState.None);
    });
  }
}

export class FissionEnvironment extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(name, collapsibleState);
    this.tooltip = `${this.name}-${this.version}`;
    this.description = this.name;
  }

  iconPath = path.join(__filename, '..', '..', 'resources', 'dependency.svg');

  contextValue = 'environments';
}
