import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";
import axios from 'axios';

import { IDeployCommand, CommandAction } from "./model";
import { IFunction } from "../model";
import * as constants from '../constants';
import config from "../../lib/config";
import packages from "../../lib/packages";

export default class ViewDeploy {
  private readonly panel: vscode.WebviewPanel | undefined;
  private readonly extensionPath: string;

  constructor(extensionPath: string, rootPath: string, configFile: string) {
    this.extensionPath = extensionPath;
    let ifunction: IFunction;
    if (!fs.existsSync(configFile)) {
      ifunction = defaultFunction;
    } else {
      let content = fs.readFileSync(configFile, "utf8");
      ifunction = JSON.parse(content);
    }
    ifunction.path = rootPath;
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

      this.panel.webview.html = this.getWebviewContent(ifunction);

      this.panel.webview.onDidReceiveMessage((command: IDeployCommand) => {
        switch (command.action) {
          case CommandAction.Deploy:
            this.deploy(configFile, command.content);
            break;
          case CommandAction.NameTest:
            this.nameTest(command.content.functionSpec.metadata.name);
            break;
          default:
            vscode.window.showErrorMessage(`Function deploy cannot find command ${command.action}`);
        }
      });
    }
  }

  private save(configFile: string, ifunction: IFunction) {
    let content: string = JSON.stringify(ifunction);
    fs.writeFileSync(configFile, content);
  }

  private deploy(configFile: string, ifunction: IFunction) {
    this.save(configFile, ifunction);
    packages.create(ifunction);
  }

  private nameTest(name: string) {
    let newCommand: IDeployCommand;
    axios.get(config.get().UrlFunctions + "/" + name).then((resp) => {
      if (resp.status !== 200) {
        newCommand = {
          action: CommandAction.NameNotExist,
          content: defaultFunction
        };
      } else {
        newCommand = {
          action: CommandAction.NameExist,
          content: defaultFunction
        };
      }
      this.panel?.webview.postMessage(newCommand);
    }).catch(err => {
      console.error(`Function deploy search function '${name}' catch err: ${err.response.status}`)
      newCommand = {
        action: CommandAction.NameNotExist,
        content: defaultFunction
      };
      this.panel?.webview.postMessage(newCommand);
    })
  }

  private getWebviewContent(config: IFunction): string {
    const reactAppPathOnDisk = vscode.Uri.file(path.join(this.extensionPath, "view", "deploy.js"));
    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    const bundleOnDisk = vscode.Uri.file(path.join(this.extensionPath, "view", "bundle.js"));
    const bundleUri = bundleOnDisk.with({ scheme: "vscode-resource" });

    return constants.tmpl(config, bundleUri, reactAppUri);
  }
}

const defaultFunction: IFunction = {
  path: "",
  functionSpec: {
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
}
