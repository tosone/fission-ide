import * as path from 'path';

import * as vscode from 'vscode';
import axios from 'axios';

import config from "../config";

export class PackageProvider implements vscode.TreeDataProvider<FissionPackage>{
  private _onDidChangeTreeData: vscode.EventEmitter<FissionPackage | undefined | void> = new vscode.EventEmitter<FissionPackage | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<FissionPackage | undefined | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FissionPackage): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FissionPackage): Thenable<FissionPackage[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.getFunction());
    }
  }

  async getFunction(): Promise<FissionPackage[]> {
    const resp = await axios.get(config.get().UrlPackages);
    return resp.data?.map((element: { metadata: { name: string; }; }) => {
      return new FissionPackage(element?.metadata?.name, "nodejs", vscode.TreeItemCollapsibleState.None);
    });
  }
}

export class FissionPackage extends vscode.TreeItem {
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

  contextValue = 'packages';
}
