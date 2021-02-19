import * as vscode from 'vscode';

import { IConfigSpec } from './model';

export default function get(): IConfigSpec {
  let server: any = vscode.workspace.getConfiguration("fission").get("server");
  if (server == undefined) {
    server = "http://127.0.0.1";
  }
  if (server.endsWith("/")) {
    server = server.substring(0, server.indexOf("/"));
  }
  return {
    UrlFunctions: `${server}/v2/functions`,
    UrlPackages: `${server}/v2/packages`,
    UrlEnvironments: `${server}/v2/environments`,
  }
};
