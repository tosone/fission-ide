import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { IDeployCommand, CommandAction } from "./app/model";
import { IFunctionSpec } from "./model";
import constants from './constants';

export default class ViewLoader {
    private readonly _panel: vscode.WebviewPanel | undefined;
    private readonly _extensionPath: string;

    constructor(extensionPath: string, configFile: string) {
        this._extensionPath = extensionPath;
        let config: IFunctionSpec;
        if (!fs.existsSync(configFile)) {
            config = defaultFunctionSpec;
        } else {
            let content = fs.readFileSync(configFile, "utf8");
            config = JSON.parse(content);
        }
        console.log(config);
        if (config) {
            this._panel = vscode.window.createWebviewPanel(
                "fissionView",
                "Function Deploy",
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(path.join(extensionPath, "view"))]
                }
            );

            this._panel.webview.html = this.getWebviewContent(config);

            this._panel.webview.onDidReceiveMessage((command: IDeployCommand) => {
                switch (command.action) {
                    case CommandAction.Save:
                        this.saveConfigFile(configFile, command.content);
                        return;
                }
            });
        }
    }

    private saveConfigFile(configFile: string, functionSpec: IFunctionSpec) {
        let content: string = JSON.stringify(functionSpec);
        fs.writeFileSync(configFile, content);
    }

    private getWebviewContent(config: IFunctionSpec): string {
        const reactAppPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, "view", "deploy.js"));
        const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

        const bundleOnDisk = vscode.Uri.file(path.join(this._extensionPath, "view", "bundle.js"));
        const bundleUri = bundleOnDisk.with({ scheme: "vscode-resource" });

        return constants.tmpl(config, reactAppUri, bundleUri);
    }
}

const defaultFunctionSpec: IFunctionSpec = {
    kind: "Function",
    apiVersion: "fission.io/v1",
    metadata: {
        name: "tosone",
        namespace: "default"
    },
    spec: {
        environment: {
            namespace: "default",
            name: ""
        },
        package: {
            packageref: {
                name: "",
                namespace: "default",
                resourceversion: ""
            },
            functionName: ""
        },
        resources: {
            limits: {
                cpu: "120m",
                memory: "100Mi"
            },
            requests: {
                cpu: "80m",
                memory: "50Mi"
            }
        },
        InvokeStrategy: {
            ExecutionStrategy: {
                ExecutorType: "poolmgr",
                MinScale: 2,
                MaxScale: 2,
                TargetCPUPercent: 80,
                SpecializationTimeout: 120
            },
            StrategyType: "execution"
        },
        functionTimeout: 60,
        idletimeout: 120,
        concurrency: 5
    }
}
