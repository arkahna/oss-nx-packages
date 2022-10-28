export interface NxTerraformRemoveFirewallExceptionsSchema {
    environmentName: string
    project: string
    removeIpFromDefaultKeyVault: boolean
    removeIpFromDefaultStorage: boolean
    removeIpFromKeyVaults?: string[]
    removeIpFromStorage?: string[]
}
