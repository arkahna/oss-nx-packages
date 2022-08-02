import execa from 'execa'
import { getTfResourceName } from './getTfResourceName'

export async function addFirewallRules({
    resourceGroupName,
    addIpToKeyVaults,
    addIpToStorageAccounts,
    publicIpv4,
    projectRoot,
    terragruntConfigFile,
}: {
    resourceGroupName: string
    addIpToKeyVaults: string[]
    addIpToStorageAccounts: string[]
    publicIpv4: string
    projectRoot: string
    terragruntConfigFile: string
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
            const result = await getTfResourceName(
                terragruntConfigFile,
                storageAccountName,
                projectRoot,
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
            await execa(
                'az',
                [
                    'storage',
                    'account',
                    'network-rule',
                    'add',
                    '-g',
                    resourceGroupName,
                    '--account-name',
                    storageAccountName,
                    '--ip-address',
                    publicIpv4,
                ],
                { stdio: 'inherit' },
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Failed to add network rule to storage', err)
        }
    }

    for (const keyVault of addIpToKeyVaults) {
        let keyVaultName = keyVault
        if (keyVaultName.includes('azurerm_key_vault')) {
            const result = await getTfResourceName(terragruntConfigFile, keyVaultName, projectRoot)
            if (!result) {
                continue
            }
            keyVaultName = result
            console.log(`Found, ${keyVaultName}`)
        }

        try {
            console.log(`Adding firewall rule to ${keyVaultName}`)
            keyVaultsToRemoveFirewallRules.push(keyVaultName)
            await execa(
                'az',
                [
                    'keyvault',
                    'network-rule',
                    'add',
                    '--name',
                    keyVaultName,
                    '--ip-address',
                    publicIpv4,
                ],
                { stdio: 'inherit' },
            )
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
