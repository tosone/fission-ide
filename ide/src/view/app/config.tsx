import * as React from "react";
import { IConfig, IUser, ICommand, CommandAction } from "./model";

import { Form, Input, Button, Select } from 'antd';

interface IConfigProps {
  vscode: any;
  initialData: IConfig;
}

interface IConfigState {
  config: IConfig;
  executor: string;
}

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 16 },
};

export default class Config extends React.Component<IConfigProps, IConfigState> {
  constructor(props: any) {
    super(props);

    let initialData = this.props.initialData;

    let oldState = this.props.vscode.getState();
    if (oldState) {
      this.state = oldState;
    } else {
      this.state = { config: initialData, executor: "poolmgr" };
    }
  }

  private defineState(newSate: IConfigState) {
    this.setState(newSate);
    this.props.vscode.setState(newSate);
  }

  onChangeUserActiveState(userIndex: number) {
    let newState = { ...this.state };
    newState.config.users[userIndex].active = !newState.config.users[userIndex].active;

    this.defineState(newState);
  }

  onFinish = (values: any) => {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  onAddRole(event: React.KeyboardEvent<HTMLInputElement>, userIndex: number) {
    if (event.key === "Enter" && event.currentTarget.value !== "") {
      let newState = { ...this.state };
      newState.config.users[userIndex].roles.push(event.currentTarget.value);
      this.defineState(newState);
      event.currentTarget.value = "";
    }
  }

  onAddUser(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && event.currentTarget.value !== "") {
      let newState = { ...this.state };
      let newUser: IUser = {
        name: event.currentTarget.value,
        active: true,
        roles: []
      };
      newState.config.users.push(newUser);
      this.defineState(newState);
      event.currentTarget.value = "";
    }
  }

  executorChange = (val: string) => {
    this.setState({ executor: val });
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="title">Deploy Function</h1>
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="functionName"
            rules={[{ required: true, message: 'Please input the function name' }]}
          >
            <Input placeholder="Function name" />
          </Form.Item>
          <Form.Item
            label="Executor"
            name="executor"
            rules={[{ required: true, message: 'Please select the function executor' }]}
          >
            <Select
              defaultValue={"poolmgr"}
              value={this.state.executor}
              onChange={this.executorChange}
            >
              <Select.Option value="poolmgr">poolmgr</Select.Option>
              <Select.Option value="newdeploy">newdeploy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Min CPU"
            name="minCPU"
            rules={[{ required: true, message: 'Please input the min CPU request!' }]}
            style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
          >
            <Input type="number" defaultValue={1} placeholder="Min CPU" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }

  saveConfig() {
    let command: ICommand = {
      action: CommandAction.Save,
      content: this.state.config
    };
    this.props.vscode.postMessage(command);
  }
}
