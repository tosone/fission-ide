import * as vscode from 'vscode';

import { IConfigSpec } from './model';

// TODO: check fission.server suffix with '/'
export default function get(): IConfigSpec {
  let server = vscode.workspace.getConfiguration("fission").get("server");
  if (server == undefined) {
    server = "http://127.0.0.1";
  }
  return {
    UrlFunctions: `${server}/v2/functions`,
    UrlPackages: `${server}/v2/packages`,
    UrlEnvironments: `${server}/v2/environments`,
  }
};
