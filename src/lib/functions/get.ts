import axios from 'axios';

import config from "../config";
import { IFunctionSpec } from "./model";

export default async function gets(name: string): Promise<IFunctionSpec> {
  const resp = await axios.get(config.get().UrlFunctions + "/" + name);
  return resp.data;
};
