import * as fs from "fs";
import * as util from 'util';

import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from 'uuid';

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
  ipackage.packageSpec.spec.deployment.literal = fs.readFileSync(ifunction.path, { encoding: "base64" });
  ipackage.packageSpec.metadata.name = ifunction.functionSpec.metadata.name + "-" + uuidv4();
  let fileStat = fs.statSync(ifunction.path);
  if (fileStat.isDirectory()) {
    console.log("this is a dir");
  } else if (fileStat.isFile()) {
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
      } else {
        return ipackage;
      }
    } catch (err) {
      ipackage.error = error.message(error.ErrorUnknown, err);
      return ipackage;
    }
  }
  return ipackage;
}
