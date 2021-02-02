import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";
import axios from 'axios';

import { CommandAction, ITestCommand, ITestSpec } from "./model";
import { IFunctionSpec } from "../model";
import * as constants from '../constants';
import config from "../../config";

export default class ViewDeploy {
  private readonly panel: vscode.WebviewPanel | undefined;
  private readonly extensionPath: string;

  constructor(extensionPath: string, rootPath: string, configFile: string) {
    this.extensionPath = extensionPath;
    let config: IFunctionSpec;
    if (!fs.existsSync(configFile)) {
      config = defaultFunctionSpec;
    } else {
      let content = fs.readFileSync(configFile, "utf8");
      config = JSON.parse(content);
    }
    config.path = rootPath;
    if (config) {
      this.panel = vscode.window.createWebviewPanel(
        "fissionView",
        "Function Deploy",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(extensionPath, "view"))]
        }
      );

      this.panel.webview.html = this.getWebviewContent(config);

      this.panel.webview.onDidReceiveMessage((command: ITestCommand) => {
        switch (command.action) {
          case CommandAction.Request:
            this.request(configFile, command.content);
            break;
          default:
            vscode.window.showErrorMessage(`Function deploy cannot find command ${command.action}`);
        }
      });
    }
  }

  private request(configFile: string, functionSpec: ITestSpec) {
    let content: string = JSON.stringify(functionSpec);
    fs.writeFileSync(configFile, content);
  }

  private getWebviewContent(config: IFunctionSpec): string {
    const reactAppPathOnDisk = vscode.Uri.file(path.join(this.extensionPath, "view", "deploy.js"));
    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    const bundleOnDisk = vscode.Uri.file(path.join(this.extensionPath, "view", "bundle.js"));
    const bundleUri = bundleOnDisk.with({ scheme: "vscode-resource" });

    return constants.tmpl(config, bundleUri, reactAppUri);
  }
}

const defaultFunctionSpec: IFunctionSpec = {
  path: "",
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
