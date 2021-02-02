import * as React from "react";

import { Form, Input, Button, Select } from 'antd';

import { CommandAction, IDeployCommand } from "../model";
import { IFunction } from '../../../lib/functions/model';

interface IDeployProps {
  vscode: any;
  ifunction: IFunction;
}

interface IDeployState {
  ifunction?: IFunction
  deployAction: CommandAction
}

export default class Deploy extends React.Component<IDeployProps, IDeployState> {
  constructor(props: any) {
    super(props);

    let ifunction = this.props.ifunction;
    let vscode = this.props.vscode;
    if (vscode.getState()) {
      this.state = { ...vscode.getState() };
    } else {
      this.state = {
        ifunction: ifunction,
        deployAction: CommandAction.Create
      };
      vscode.setState({ ...this.state });
    }
    this.listen();
    let command: IDeployCommand = {
      action: CommandAction.NameTest,
      content: this.state.ifunction
    };
    this.props.vscode.postMessage(command);
  }

  functionDeploy = () => {
    let command: IDeployCommand = {
      action: this.state.deployAction,
      content: this.state.ifunction
    };
    this.props.vscode.postMessage(command);
  }

  listen = () => {
    window.addEventListener('message', event => {
      const command: IDeployCommand = event.data;
      switch (command.action) {
        case CommandAction.NameExist:
          this.state.ifunction.functionSpec.metadata.resourceVersion = command.content.functionSpec.metadata.resourceVersion;
          this.setState({ ...this.state });
          this.setState({ deployAction: CommandAction.Update }); // TODO: useState
          break;
        case CommandAction.NameNotExist:
          this.state.ifunction.functionSpec.metadata.resourceVersion = "";
          this.setState({ deployAction: CommandAction.Create });
          break;
        default:
          console.error(`Function deploy cannot find command ${command.action}`);
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="title">Deploy Function</h1>
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{
            path: this.state.ifunction.path,
            functionName: this.state.ifunction.functionSpec.metadata.name,
            entryPoint: this.state.ifunction.functionSpec.spec.package.functionName,
            packageName: this.state.ifunction.functionSpec.spec.package.functionName,
            executor: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType,
            minCPU: parseInt(this.state.ifunction.functionSpec.spec.resources.requests.cpu),
            maxCPU: parseInt(this.state.ifunction.functionSpec.spec.resources.limits.cpu),
            minMem: parseInt(this.state.ifunction.functionSpec.spec.resources.requests.memory),
            maxMem: parseInt(this.state.ifunction.functionSpec.spec.resources.limits.memory),
            targetCPU: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent,
            minReplica: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale,
            maxReplica: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale,
          }}
        >
          <Form.Item
            label="Path"
            name="path"
            extra="Package Path"
          >
            <Input
              type="text"
              placeholder="Package Path"
              value={this.state.ifunction.path}
              readOnly
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.path = event.target.value;
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name="functionName"
            rules={[{ required: true, message: 'Please input the function name' }]}
            extra="Function name"
          >
            <Input
              type="text"
              placeholder="Function name"
              value={this.state.ifunction.functionSpec.metadata.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.metadata.name = event.target.value;
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
                let command: IDeployCommand = {
                  action: CommandAction.NameTest,
                  content: this.state.ifunction
                };
                this.props.vscode.postMessage(command);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Entry Point"
            name="entryPoint"
            extra="Entry point for environment v2 to load with"
          >
            <Input
              type="text"
              placeholder="Entry Point"
              value={this.state.ifunction.functionSpec.spec.package.functionName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.package.functionName = event.target.value;
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Package name"
            name="packageName"
            extra="Name of the existing package (--deploy and --src and --env will be ignored), should be in the same namespace as the function"
          >
            <Input
              type="text"
              placeholder="Package name"
              value={this.state.ifunction.functionSpec.spec.package.functionName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.package.functionName = event.target.value;
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Executor"
            name="executor"
            rules={[{ required: true, message: 'Please select the function executor' }]}
            extra="Executor type for execution; one of 'poolmgr', 'newdeploy'"
          >
            <Select
              value={this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType}
              onChange={(val: string) => {
                this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType = val;
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            >
              <Select.Option value="poolmgr">poolmgr</Select.Option>
              <Select.Option value="newdeploy">newdeploy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Min CPU"
            name="minCPU"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Minimum CPU to be assigned to pod (In millicore, minimum 1)"
          >
            <Input
              type="number"
              value={parseInt(this.state.ifunction.functionSpec.spec.resources.requests.cpu)}
              placeholder="Min CPU"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.resources.requests.cpu = event.target.value + "m";
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Max CPU"
            name="maxCPU"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Maximum CPU to be assigned to pod (In millicore, minimum 1)"
          >
            <Input
              type="number"
              value={parseInt(this.state.ifunction.functionSpec.spec.resources.limits.cpu)}
              placeholder="Max CPU"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.resources.limits.cpu = event.target.value + "m";
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Min Memory"
            name="minMem"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Minimum memory to be assigned to pod (In megabyte)"
          >
            <Input
              type="number"
              value={parseInt(this.state.ifunction.functionSpec.spec.resources.requests.memory)}
              placeholder="Min Memory"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.resources.requests.memory = event.target.value + "Mi";
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Max Memory"
            name="maxMem"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Maximum memory to be assigned to pod (In megabyte)"
          >
            <Input
              type="number"
              value={parseInt(this.state.ifunction.functionSpec.spec.resources.limits.memory)}
              placeholder="Max Memory"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.resources.limits.memory = event.target.value + "Mi";
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Target CPU"
            name="targetCPU"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Target average CPU usage percentage across pods for scaling (default: 80)"
          >
            <Input
              type="number"
              value={this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent}
              placeholder="Target CPU"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent = parseInt(event.target.value);
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Min Replica"
            name="minReplica"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Minimum number of pods (Uses resource inputs to configure HPA)"
          >
            <Input
              type="number"
              value={this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale}
              placeholder="Min Replica"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale = parseInt(event.target.value);
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Max Replica"
            name="maxReplica"
            style={{ display: this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
            extra="Maximum number of pods (Uses resource inputs to configure HPA)"
          >
            <Input
              type="number"
              value={this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale}
              placeholder="Max Replica"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.state.ifunction.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale = parseInt(event.target.value);
                this.props.vscode.setState({ ...this.state });
                this.setState({ ...this.state });
              }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
            <Button type="primary" onClick={this.functionDeploy}>{
              this.state.deployAction === CommandAction.Create ? "Create" : "Update"
            }</Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}
