import * as path from 'path';

import axios from 'axios';
import * as vscode from 'vscode';

import config from "../config";
import { IFunctionSpec } from './model';

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
    if (resp.status !== 200) {
      return [];
    } else {
      return resp.data.map((element: IFunctionSpec) => {
        return new FissionFunction(element.metadata.name, element.spec.environment.name);
      });
    }
  }
}

export class FissionFunction extends vscode.TreeItem {
  constructor(public readonly label: string, private readonly language: string) {
    super(label);
    this.tooltip = this.label;
    this.description = this.language;
  }

  iconPath = path.join(__filename, '..', '..', 'resources', 'dependency.svg');

  contextValue = 'functions';
}
