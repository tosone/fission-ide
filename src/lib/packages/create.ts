import * as fs from "fs";
import * as os from 'os';
import * as util from 'util';
import * as path from 'path';
import * as vscode from 'vscode';

import AdmZip = require('adm-zip');
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosRequestConfig } from "axios";

import { IPackage } from "./model";
import config from "../config";
import error from "../../error";
import { IFunction } from "../functions/model";

export default async function create(ifunction: IFunction): Promise<IPackage> {
  let ipackage: IPackage = {
    "packageSpec": {
      "kind": "Package",
      "apiVersion": "fission.io/v1",
      "metadata": {
        "name": "",
        "namespace": "default"
      },
      "spec": {
        "environment": {
          "name": "nodejs",
          "namespace": "default"
        },
        "deployment": {
          "type": "literal",
          "literal": "",
        }
      },
    }
  };
  if (!fs.existsSync(ifunction.path)) {
    ipackage.error = error.ErrorFileNotExist;
    util.format(ipackage.error.message, ifunction.path);
    return ipackage;
  }
  ipackage.packageSpec.metadata.name = ifunction.functionSpec.metadata.name + "-" + uuidv4();
  let literal: string = "";
  let fileStat = fs.statSync(ifunction.path);
  if (fileStat.isDirectory()) {
    var zip = new AdmZip();
    zip.addLocalFolder(ifunction.path);
    let archive = path.join(os.tmpdir(), 'sample.zip');
    zip.writeZip(archive);
    literal = fs.readFileSync(archive, { encoding: "base64" });
    fs.unlinkSync(archive);
  } else if (fileStat.isFile()) {
    literal = fs.readFileSync(ifunction.path, { encoding: "base64" });
  } else {
    vscode.window.showErrorMessage(`no such a file or dir: ${ifunction.path}`);
    ipackage.error = error.message(error.ErrorFileNotExist, ifunction.path);
    return ipackage;
  }
  ipackage.packageSpec.spec.deployment.literal = literal;
  try {
    let axiosRequestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: config.get().UrlPackages,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(ipackage.packageSpec)
    };
    const resp = await axios.request(axiosRequestConfig);
    if (resp.status !== 201) {
      ipackage.error = error.message(error.ErrorUnknown, resp);
      return ipackage;
    }
  } catch (err) {
    ipackage.error = error.message(error.ErrorUnknown, err);
    return ipackage;
  }

  return ipackage;
}
