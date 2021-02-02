import axios from 'axios';
import * as vscode from 'vscode';

import config from '../config';

async function del(label: string | vscode.TreeItemLabel | undefined) {
  if (label == undefined) {
    return Promise.resolve([]);
  }
  let environmentName = label.toString()
  let resp = await axios.delete(config.get().UrlEnvironments + "/" + environmentName);
  if (resp.status == 200) {
    vscode.window.showInformationMessage(`Delete environment ${environmentName} success`);
  } else {
    vscode.window.showErrorMessage(`Delete environment ${environmentName} with status code ${resp.status}, body: ${resp.data}`);
  }
}

export default del;
