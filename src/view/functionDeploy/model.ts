import { IFunction } from "../../lib/functions/model";

export interface IDeployCommand {
  action: CommandAction;
  content: IFunction;
}

export enum CommandAction { Create, Update, NameTest, NameExist, NameNotExist }