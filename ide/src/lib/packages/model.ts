export interface IPackageSpec {
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
    source?: {
      type?: string
      literal?: string
      url?: string
      checksum?: {
        type?: string
        sum?: string
      }
    }
    deployment: {
      type: string
      literal: string
      url?: string
      checksum?: {
        type?: string
        sum?: string
      }
    }
  }
  status?: {
    buildstatus?: string
    buildlog?: string
  }
}

export interface IPackage {
  error?: Error
  packageSpec: IPackageSpec
}
