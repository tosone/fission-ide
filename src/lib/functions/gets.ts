import axios from 'axios';

import config from "../config";
import { IFunctionSpec } from "./model";

export default async function gets(): Promise<IFunctionSpec[]> {
  const resp = await axios.get(config.get().UrlFunctions);
  return resp.data;
};
