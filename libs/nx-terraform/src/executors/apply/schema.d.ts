export interface ApplyExecutorSchema {
    environment: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
    var?: string[]
    firewallRetryAttempts: number
    firewallRetryDelay: number
    tfTarget?: string
    quick?: boolean
    leaveFirewallExceptions?: boolean
}
