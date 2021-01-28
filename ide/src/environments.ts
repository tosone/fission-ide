import * as path from 'path';

import * as vscode from 'vscode';
import axios from 'axios';

import constants from "./constants";

export class FissionEnvironmentProvider implements vscode.TreeDataProvider<FissionEnvironment>{
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
        const resp = await axios.get(constants.UrlEnvironments);
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

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

    contextValue = 'dependency';
}
