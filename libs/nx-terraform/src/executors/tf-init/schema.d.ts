export interface InitExecutorSchema {
    upgrade?: boolean
    reconfigure?: boolean
    migrateState?: boolean
    environment?: string
    addIpToDefaultStorage: boolean
    firewallRetryAttempts: number
    firewallRetryDelay: number
}
