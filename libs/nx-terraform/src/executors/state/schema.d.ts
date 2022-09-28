export interface StateExecutorSchema {
    command: string
    address?: string
    environment: string
    addIpToDefaultStorage: boolean
    firewallRetryAttempts: number
    firewallRetryDelay: number
    json: boolean
}
