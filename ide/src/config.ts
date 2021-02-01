import * as vscode from 'vscode';

export interface IConfigSpec {
  UrlFunctions: string
  UrlPackages: string
  UrlEnvironments: string
}

const Config = (): IConfigSpec | null => {
  let server = vscode.workspace.getConfiguration("fission").get("server");
  if (server == undefined || server == "") {
    return null;
  }
  return {
    UrlFunctions: `${server}/v2/functions`,
    UrlPackages: `${server}/v2/packages`,
    UrlEnvironments: `${server}/v2/environments`,
  }
};

export default Config;
