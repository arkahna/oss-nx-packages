import execa from 'execa'

export async function removeFirewallRules({
    resourceGroupName,
    subscriptionId,
    removeIpFromKeyVaults,
    removeIpFromStorageAccounts,
    publicIpv4,
}: {
    resourceGroupName: string
    subscriptionId: string
    removeIpFromKeyVaults: string[]
    removeIpFromStorageAccounts: string[]
    publicIpv4: string
}) {
    // Key vault automatically adds the /32 CIDR to the ip addresses when you add them
    const ipWithCdir = `${publicIpv4}/32`
    for (const keyVaultName of removeIpFromKeyVaults) {
        try {
            await execa('az', [
                'keyvault',
                'network-rule',
                'remove',
                '--subscription',
                subscriptionId,
                '--name',
                keyVaultName,
                '--ip-address',
                ipWithCdir,
            ])
        } catch (err) {
            console.error('Failed to remove network rule from keyvault', err)
        }
    }

    for (const storageAccount of removeIpFromStorageAccounts) {
        try {
            await execa('az', [
                'storage',
                'account',
                'network-rule',
                'remove',
                '--subscription',
                subscriptionId,
                '--resource-group',
                resourceGroupName,
                '--account-name',
                storageAccount,
                '--ip-address',
                publicIpv4,
            ])
        } catch (err) {
            console.error(
                `Failed to remove network rule from storage account ${storageAccount}`,
                err,
            )
        }
    }
}
