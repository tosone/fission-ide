export interface ITestSpec {
  request: {
    method: string
    headers: Map<string, string>
    body: string
  }
  response: {
    headers: Map<string, string>
    body: string
  }
}

export interface ITestCommand {
  action: CommandAction
  content: ITestSpec
}

export enum CommandAction { Request, Response }
