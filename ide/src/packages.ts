import * as path from 'path';

import * as vscode from 'vscode';
import axios from 'axios';

import constants from "./constants";

export class FissionPackageProvider implements vscode.TreeDataProvider<FissionPackage>{
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
        const resp = await axios.get(constants.UrlPackages);
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

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

    contextValue = 'dependency';
}
