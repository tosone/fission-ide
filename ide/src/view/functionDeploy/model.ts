import { IFunction } from "../model";

export interface IDeployCommand {
  action: CommandAction;
  content: IFunction;
}

export enum CommandAction { Deploy, NameTest, NameExist, NameNotExist }
