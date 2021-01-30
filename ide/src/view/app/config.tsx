import * as React from "react";

import { Form, Input, Button, Select } from 'antd';

import { CommandAction, IDeployCommand } from "./model";
import { IFunctionSpec } from '../model';

interface IConfigProps {
    vscode: any;
    initialData: IFunctionSpec;
}

interface IConfigState {
    functionSpec?: IFunctionSpec
}

export default class Config extends React.Component<IConfigProps, IConfigState> {
    constructor(props: any) {
        super(props);

        let initialData = this.props.initialData;
        let vscode = this.props.vscode;
        if (vscode.getState()) {
            this.state = { "executor": "poolmgr", ...vscode.getState() };
        } else {
            this.state = {
                functionSpec: initialData
            };
            vscode.setState({ ...this.state });
        }
    }

    saveFunctionSpec = () => {
        let command: IDeployCommand = {
            action: CommandAction.Save,
            content: this.state.functionSpec
        };
        this.props.vscode.postMessage(command);
    }

    render() {
        return (
            <React.Fragment>
                <h1 className="title">Deploy Function</h1>
                <Form
                    name="basic"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                >
                    <Form.Item
                        label="Name"
                        name="functionName"
                        rules={[{ required: true, message: 'Please input the function name' }]}
                        extra="Function name"
                    >
                        <Input
                            type="text"
                            placeholder="Function name"
                            defaultValue={this.state.functionSpec.metadata.name}
                            value={this.state.functionSpec.metadata.name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.metadata.name = event.target.value;
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
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
                            defaultValue={this.state.functionSpec.spec.package.functionName}
                            value={this.state.functionSpec.spec.package.functionName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.package.functionName = event.target.value;
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
                            defaultValue={this.state.functionSpec.spec.package.functionName}
                            value={this.state.functionSpec.spec.package.functionName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.package.functionName = event.target.value;
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
                            defaultValue="poolmgr"
                            value={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType}
                            onChange={(val: string) => {
                                this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType = val;
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
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Minimum CPU to be assigned to pod (In millicore, minimum 1)"
                    >
                        <Input
                            type="number"
                            defaultValue={parseInt(this.state.functionSpec.spec.resources.requests.cpu)}
                            value={parseInt(this.state.functionSpec.spec.resources.requests.cpu)}
                            placeholder="Min CPU"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.resources.requests.cpu = event.target.value + "m";
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Max CPU"
                        name="maxCPU"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Maximum CPU to be assigned to pod (In millicore, minimum 1)"
                    >
                        <Input
                            type="number"
                            defaultValue={parseInt(this.state.functionSpec.spec.resources.limits.cpu)}
                            value={parseInt(this.state.functionSpec.spec.resources.limits.cpu)}
                            placeholder="Max CPU"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.resources.limits.cpu = event.target.value + "m";
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Min Memory"
                        name="minMem"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Minimum memory to be assigned to pod (In megabyte)"
                    >
                        <Input
                            type="number"
                            defaultValue={parseInt(this.state.functionSpec.spec.resources.requests.memory)}
                            value={parseInt(this.state.functionSpec.spec.resources.requests.memory)}
                            placeholder="Min Memory"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.resources.requests.memory = event.target.value + "Mi";
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Max Memory"
                        name="maxMem"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Maximum memory to be assigned to pod (In megabyte)"
                    >
                        <Input
                            type="number"
                            defaultValue={parseInt(this.state.functionSpec.spec.resources.limits.memory)}
                            value={parseInt(this.state.functionSpec.spec.resources.limits.memory)}
                            placeholder="Max Memory"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.resources.limits.memory = event.target.value + "Mi";
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Target CPU"
                        name="targetCPU"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Target average CPU usage percentage across pods for scaling (default: 80)"
                    >
                        <Input
                            type="number"
                            defaultValue={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent}
                            value={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent}
                            placeholder="Target CPU"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent = parseInt(event.target.value);
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Min Replica"
                        name="minReplica"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Minimum number of pods (Uses resource inputs to configure HPA)"
                    >
                        <Input
                            type="number"
                            defaultValue={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale}
                            value={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale}
                            placeholder="Min Replica"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MinScale = parseInt(event.target.value);
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Max Replica"
                        name="maxReplica"
                        style={{ display: this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.ExecutorType == "poolmgr" ? "none" : "" }}
                        extra="Maximum number of pods (Uses resource inputs to configure HPA)"
                    >
                        <Input
                            type="number"
                            defaultValue={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale}
                            value={this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale}
                            placeholder="Max Replica"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.functionSpec.spec.InvokeStrategy.ExecutionStrategy.MaxScale = parseInt(event.target.value);
                                this.props.vscode.setState({ ...this.state });
                                this.setState({ ...this.state });
                            }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary" htmlType="submit" onClick={this.saveFunctionSpec}>Create</Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}
