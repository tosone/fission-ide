import * as vscode from 'vscode';

import * as path from 'path';

export class FissionFunctionProvider implements vscode.TreeDataProvider<FissionFunction>{
    getTreeItem(element: FissionFunction): vscode.TreeItem {
        return element;
    }
    getChildren(element?: FissionFunction): Thenable<FissionFunction[]> {
        return Promise.resolve([]);
    }
}


export class FissionFunction extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

    contextValue = 'dependency';
}
