export interface NxTerraformAddFirewallExceptionsSchema {
    environmentName: string
    project?: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
    firewallRetryAttempts: number
    firewallRetryDelay: number
}
