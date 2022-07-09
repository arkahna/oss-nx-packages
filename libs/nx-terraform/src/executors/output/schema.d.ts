export interface OutputExecutorSchema {
    name?: string
    json?: boolean
    environment: string
    addIpToDefaultStorage: boolean
    firewallRetryAttempts: number
    firewallRetryDelay: number
}
