import axios from 'axios';

import config from "../config";
import { IEnvironmentSpec } from "./model";

export default async function get(): Promise<IEnvironmentSpec[]> {
  const resp = await axios.get(config.get().UrlEnvironments);
  return resp.data;
};
