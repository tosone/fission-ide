import * as React from "react";
import * as ReactDOM from "react-dom";

import Deploy from "./deploy";
import { IFunction } from "../../../lib/functions/model";

import "../../index.scss";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    ifunction: IFunction;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <Deploy vscode={vscode} ifunction={window.ifunction} />,
  document.getElementById("root")
);
