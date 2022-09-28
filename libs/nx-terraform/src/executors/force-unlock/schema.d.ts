export interface StateExecutorSchema {
    lockId: string
    environment: string
    addIpToDefaultStorage: boolean
    firewallRetryAttempts: number
    firewallRetryDelay: number
}
