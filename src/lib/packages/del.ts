import axios from 'axios';
import * as vscode from 'vscode';

import config from '../config';

async function del(label: string | vscode.TreeItemLabel | undefined) {
  if (label == undefined) {
    return Promise.resolve([]);
  }
  let packageName = label.toString()
  let resp = await axios.delete(config.get().UrlPackages + "/" + packageName);
  if (resp.status == 200) {
    vscode.window.showInformationMessage(`Delete package ${packageName} success`);
  } else {
    vscode.window.showErrorMessage(`Delete package ${packageName} with status code ${resp.status}, body: ${resp.data}`);
  }
}

export default del;
