export interface IEnvironmentSpec {
  kind: string;
  apiVersion: string;
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    generation: number;
    creationTimestamp: string;
  }
  spec: {
    version: number;
    runtime: {
      image: string;
    }
    builder: {
      image: string;
      command: string;
    }
    resources: {
      limits: {
        cpu: string;
        memory: string;
      }
      requests: {
        cpu: string;
        memory: string;
      }
    }
    poolsize: number;
    keeparchive: boolean;
    imagepullsecret: string;
  }
};
