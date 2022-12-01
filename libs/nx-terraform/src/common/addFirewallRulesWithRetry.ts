import execa from 'execa'
import { getTfResourceNameWithRetry } from './getTfResourceNameWithRetry'

export async function addFirewallRulesWithRetry({
    resourceGroupName,
    subscriptionId,
    addIpToKeyVaults,
    addIpToStorageAccounts,
    publicIpv4,
    projectRoot,
    terragruntConfigFile,
    retryAttempts,
    retryDelay,
}: {
    resourceGroupName: string
    subscriptionId: string
    addIpToKeyVaults: string[]
    addIpToStorageAccounts: string[]
    publicIpv4: string
    projectRoot: string
    terragruntConfigFile: string
    retryAttempts: number
    /** Retry delay, in seconds */
    retryDelay: number
}): Promise<{
    keyVaultsToRemoveFirewallRules: string[]
    storageAccountsToRemoveFirewallRules: string[]
}> {
    const keyVaultsToRemoveFirewallRules: string[] = []
    const storageAccountsToRemoveFirewallRules: string[] = []

    for (const storageAccount of addIpToStorageAccounts) {
        let storageAccountName = storageAccount
        if (storageAccountName.includes('azurerm_storage_account')) {
            console.log(`Finding resource for tf resource ${storageAccountName}`)
            const result = await getTfResourceNameWithRetry(
                terragruntConfigFile,
                storageAccountName,
                projectRoot,
                retryAttempts,
                retryDelay,
            )
            if (!result) {
                continue
            }
            storageAccountName = result

            console.log(`Found, ${storageAccountName}`)
        }

        try {
            console.log(`Adding firewall rule to ${storageAccountName}`)
            storageAccountsToRemoveFirewallRules.push(storageAccountName)
            await execa('az', [
                'storage',
                'account',
                'network-rule',
                'add',
                '--subscription',
                subscriptionId,
                '--resource-group',
                resourceGroupName,
                '--account-name',
                storageAccountName,
                '--ip-address',
                publicIpv4,
            ])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Failed to add network rule to storage', err)
        }
    }

    for (const keyVault of addIpToKeyVaults) {
        let keyVaultName = keyVault
        if (keyVaultName.includes('azurerm_key_vault')) {
            const result = await getTfResourceNameWithRetry(
                terragruntConfigFile,
                keyVaultName,
                projectRoot,
                retryAttempts,
                retryDelay,
            )
            if (!result) {
                continue
            }
            keyVaultName = result
            console.log(`Found, ${keyVaultName}`)
        }

        try {
            console.log(`Adding firewall rule to ${keyVaultName}`)
            keyVaultsToRemoveFirewallRules.push(keyVaultName)
            await execa('az', [
                'keyvault',
                'network-rule',
                'add',
                '--subscription',
                subscriptionId,
                '--name',
                keyVaultName,
                '--ip-address',
                publicIpv4,
            ])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Failed to add network rule to keyvault', err)
        }
    }

    return {
        keyVaultsToRemoveFirewallRules,
        storageAccountsToRemoveFirewallRules,
    }
}
