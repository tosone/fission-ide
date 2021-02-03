import * as path from 'path';

import axios from 'axios';
import * as vscode from 'vscode';

import config from "../config";
import { IEnvironmentSpec } from './model';

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
    if (resp.status !== 200) {
      return [];
    } else {
      return resp.data.map((element: IEnvironmentSpec) => {
        return new FissionEnvironment(element.metadata.name);
      });
    }
  }
}

export class FissionEnvironment extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    this.tooltip = this.label;
  }

  iconPath = path.join(__filename, '..', '..', 'resources', 'dependency.svg');

  contextValue = 'environments';
}
