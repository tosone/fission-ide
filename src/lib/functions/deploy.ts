import axios, { AxiosRequestConfig } from "axios";

import config from "../config";
import error from "../../error";
import { IFunction } from "./model";
import { CommandAction } from "../../view/functionDeploy/model";

export default async function deploy(ifunction: IFunction, commandAction: CommandAction): Promise<IFunction> {
  try {
    let axiosRequestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: config.get().UrlFunctions,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(ifunction.functionSpec)
    };
    if (commandAction == CommandAction.Update) {
      axiosRequestConfig.method = 'PUT';
      axiosRequestConfig.url += `/${ifunction.functionSpec.metadata.name}`;
    }
    const resp = await axios.request(axiosRequestConfig);
    console.log(resp.status);
    if ((resp.status !== 201 && commandAction == CommandAction.Create) ||
      (resp.status !== 200 && commandAction == CommandAction.Update)) {
      ifunction.error = error.message(error.ErrorUnknown, resp);
      return ifunction;
    } else {
      return ifunction;
    }
  } catch (err) {
    ifunction.error = error.message(error.ErrorUnknown, err);
    return ifunction;
  }
}
