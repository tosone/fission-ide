export interface IFunctionSpec {
  kind: string
  apiVersion: string
  metadata: {
    name: string
    namespace: string
    selfLink?: string
    uid?: string
    resourceVersion?: string
    generation?: number
    creationTimestamp?: string
  }
  spec: {
    environment: {
      namespace: string
      name: string
    }
    package: {
      packageref: {
        namespace: string
        name: string
        resourceversion: string
      }
      functionName?: string
    }
    secrets?: {
      namespace: string
      name: string
    }
    configmaps?: {
      namespace: string
      name: string
    }
    resources?: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    InvokeStrategy?: {
      ExecutionStrategy: {
        ExecutorType: string
        MinScale?: number
        MaxScale?: number
        TargetCPUPercent?: number
        SpecializationTimeout?: number
      }
      StrategyType: string
    }
    functionTimeout: number
    idletimeout: number
    concurrency: number
  }
};

export interface IFunction {
  path: string;
  error?: Error;
  functionSpec: IFunctionSpec;
};
