import * as vscode from "vscode";

export default function update(server: string) {
  let fission = vscode.workspace.getConfiguration("fission");
  fission.update("server", server, true);
}
