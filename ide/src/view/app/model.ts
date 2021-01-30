import { IFunctionSpec } from "../model";

export interface IConfig {
  name: string;
  description: string;
  users: IUser[];
}

export interface IUser {
  name: string;
  active: boolean;
  roles: string[];
}

export interface IDeployCommand {
  action: CommandAction;
  content: IFunctionSpec;
}

export enum CommandAction {
  Save
}
