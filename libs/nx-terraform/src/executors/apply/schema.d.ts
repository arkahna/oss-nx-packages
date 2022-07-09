export interface ApplyExecutorSchema {
    environment: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
    variables?: string[]
    firewallRetryAttempts: number
    firewallRetryDelay: number
    tfTarget?: string
}
