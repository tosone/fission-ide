import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.scss";
import Config from "./config";
import { IFunctionSpec } from "../model";

declare global {
    interface Window {
        acquireVsCodeApi(): any;
        initialData: IFunctionSpec;
    }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
    <Config vscode={vscode} initialData={window.initialData} />,
    document.getElementById("root")
);
