export interface PlanExecutorSchema {
    environment: string
    addIpToDefaultKeyVault: boolean
    addIpToDefaultStorage: boolean
    addIpToKeyVaults?: string[]
    addIpToStorage?: string[]
    variables?: string[]
    destroy?: boolean
    firewallRetryAttempts: number
    firewallRetryDelay: number
    tfTarget?: string
}
