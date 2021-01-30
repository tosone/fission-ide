import * as React from "react";
import * as ReactDOM from "react-dom";

import Deploy from "./deploy";
import { IFunctionSpec } from "../../model";

import "../../index.scss";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: IFunctionSpec;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <Deploy vscode={vscode} initialData={window.initialData} />,
  document.getElementById("root")
);
