import { IFunctionSpec } from "../model";

export interface IDeployCommand {
  action: CommandAction;
  content: IFunctionSpec;
}

export enum CommandAction { Deploy, NameTest, NameExist, NameNotExist }
