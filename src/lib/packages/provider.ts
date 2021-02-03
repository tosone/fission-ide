import * as path from 'path';

import axios from 'axios';
import * as vscode from 'vscode';

import config from "../config";
import { IPackageSpec } from './model';

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
    if (resp.status !== 200) {
      return [];
    } else {
      return resp.data.map((element: IPackageSpec) => {
        return new FissionPackage(element.metadata.name);
      });
    }
  }
}

export class FissionPackage extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    this.tooltip = this.label;
  }

  iconPath = path.join(__filename, '..', '..', 'resources', 'dependency.svg');

  contextValue = 'packages';
}
