import * as vscode from 'vscode';

const Config = () => {
  let server = vscode.workspace.getConfiguration("fission").get("server");
  return {
    UrlFunctions: `${server}/v2/functions`,
    UrlPackages: `${server}/v2/packages`,
    UrlEnvironments: `${server}/v2/environments`,
  }
};

export default Config;
