export interface StateExecutorSchema {
    command: string
    address?: string
    environment: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
    firewallRetryAttempts: number
    firewallRetryDelay: number
    json: boolean
}
