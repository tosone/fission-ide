import axios from 'axios';
import * as vscode from 'vscode';

import config from '../../config';

async function Delete(label: string | vscode.TreeItemLabel | undefined) {
  let cfg = config();
  if (cfg === null) {
    vscode.window.showErrorMessage(`Delete function with error: cannot get the config server`);
    return;
  }
  if (label == undefined) {
    return Promise.resolve([]);
  }
  let functionName = label.toString()
  let resp = await axios.delete(cfg.UrlFunctions + "/" + functionName);
  if (resp.status == 200) {
    vscode.window.showInformationMessage(`Delete function ${functionName} success`);
  } else {
    vscode.window.showErrorMessage(`Delete function ${functionName} with status code ${resp.status}, body: ${resp.data}`);
  }
}

export default Delete;
