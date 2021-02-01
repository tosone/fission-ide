import * as vscode from "vscode";

import { IFunction } from "./model";

const tmpl = (ifunction: IFunction, bundleUri: vscode.Uri, reactAppUri: vscode.Uri) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fission Function Deploy</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">
        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.ifunction = ${JSON.stringify(ifunction)};
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script src="${bundleUri}"></script>
        <script src="${reactAppUri}"></script>
    </body>
    </html>`
}

export {
  tmpl
};
