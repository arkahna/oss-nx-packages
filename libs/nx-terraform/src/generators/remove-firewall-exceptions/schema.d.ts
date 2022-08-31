export interface NxTerraformAddFirewallExceptionsSchema {
    environmentName: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
}
