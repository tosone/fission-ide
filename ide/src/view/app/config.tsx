import * as React from "react";

import { Form, Input, Button, Select } from 'antd';

import { IConfig, IUser, ICommand, CommandAction } from "./model";
import { IFunctionSpec } from '../../model';

interface IConfigProps {
    vscode: any;
    initialData: IConfig;
}

interface IConfigState {
    config: IConfig
    functionSpec?: IFunctionSpec
    executor: string
    functionName: string
}

export default class Config extends React.Component<IConfigProps, IConfigState> {
    constructor(props: any) {
        super(props);

        let initialData = this.props.initialData;
        let oldState = this.props.vscode.getState();
        console.log(oldState);
        if (oldState) {
            this.state = { "executor": "poolmgr", ...oldState };
        } else {
            this.state = {
                config: initialData,
                executor: "poolmgr",
                functionName: ""
            };
        }
        this.props.vscode.setState({ functionName: "val" });
    }

    executorChange = (val: string) => {
        this.setState({ executor: val });
    }

    saveConfig() {
        let command: ICommand = {
            action: CommandAction.Save,
            content: this.state.config
        };
        this.props.vscode.postMessage(command);
    }

    functionNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.vscode.setState({ functionName: event.target.value });
        this.setState({ functionName: event.target.value });
        console.log(this.props.vscode.getState());
    }

    render = () => {
        console.log(this.state.functionName)
        console.log(this.state.executor)
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
                        <Input type="text" placeholder="Function name" defaultValue={this.state.functionName} value={this.state.functionName} onChange={this.functionNameOnChange} />
                    </Form.Item>
                    <Form.Item
                        label="Entry Point"
                        name="entryPoint"
                        extra="Entry point for environment v2 to load with"
                    >
                        <Input placeholder="Entry Point" />
                    </Form.Item>
                    <Form.Item
                        label="Package name"
                        name="packageName"
                        extra="Name of the existing package (--deploy and --src and --env will be ignored), should be in the same namespace as the function"
                    >
                        <Input placeholder="Package name" />
                    </Form.Item>
                    <Form.Item
                        label="Executor"
                        name="executor"
                        rules={[{ required: true, message: 'Please select the function executor' }]}
                        extra="Executor type for execution; one of 'poolmgr', 'newdeploy'"
                    >
                        <Select
                            defaultValue="poolmgr"
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
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Minimum CPU to be assigned to pod (In millicore, minimum 1)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Min CPU" />
                    </Form.Item>
                    <Form.Item
                        label="Max CPU"
                        name="maxCPU"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Maximum CPU to be assigned to pod (In millicore, minimum 1)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Max CPU" />
                    </Form.Item>
                    <Form.Item
                        label="Min Memory"
                        name="minMem"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Minimum memory to be assigned to pod (In megabyte)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Min Memory" />
                    </Form.Item>
                    <Form.Item
                        label="Max Memory"
                        name="maxMem"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Maximum memory to be assigned to pod (In megabyte)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Max Memory" />
                    </Form.Item>
                    <Form.Item
                        label="Target CPU"
                        name="targetCPU"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Target average CPU usage percentage across pods for scaling (default: 80)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Max Memory" />
                    </Form.Item>
                    <Form.Item
                        label="Min Replica"
                        name="minReplica"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Minimum number of pods (Uses resource inputs to configure HPA)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Min Replica" />
                    </Form.Item>
                    <Form.Item
                        label="Max Replica"
                        name="maxReplica"
                        style={{ display: this.state.executor == "poolmgr" ? "none" : "" }}
                        extra="Maximum number of pods (Uses resource inputs to configure HPA)"
                    >
                        <Input type="number" defaultValue={1} placeholder="Max Replica" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}
