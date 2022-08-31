export interface NxTerraformRemoveFirewallExceptionsSchema {
    environmentName: string
    removeIpFromDefaultKeyVault: boolean
    removeIpFromDefaultStorage: boolean
    removeIpFromKeyVaults?: string[]
    removeIpFromStorage?: string[]
}
