import axios from 'axios';
import * as vscode from 'vscode';

import config from '../config';

async function Delete(label: string | vscode.TreeItemLabel | undefined) {
  if (label == undefined) {
    return Promise.resolve([]);
  }
  let functionName = label.toString()
  let resp = await axios.delete(config.get().UrlFunctions + "/" + functionName);
  if (resp.status == 200) {
    vscode.window.showInformationMessage(`Delete function ${functionName} success`);
  } else {
    vscode.window.showErrorMessage(`Delete function ${functionName} with status code ${resp.status}, body: ${resp.data}`);
  }
}

export default Delete;
