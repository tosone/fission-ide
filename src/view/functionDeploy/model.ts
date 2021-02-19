import { IFunction } from "../../lib/functions/model";

export interface IDeployCommand {
  action: CommandAction;
  content: IFunction;
};

export enum CommandAction {
  Create, // Create a function
  Update, // Update specific function
  CreateDone, // Create function done
  UpdateDone, // Update function done
  NameTest, // test function name is valid or not
  NameExist, // function is already exist
  NameNotExist, // function is valid
};
