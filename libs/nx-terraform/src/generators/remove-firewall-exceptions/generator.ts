import { Tree } from '@nrwl/devkit'
import publicIp from 'public-ip'
import { isDryRun } from '../../common/isDryRun'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { removeFirewallRules } from '../../common/removeFirewallRules'
import { NxTerraformRemoveFirewallExceptionsSchema } from './schema'

export default async function (tree: Tree, options: NxTerraformRemoveFirewallExceptionsSchema) {
    const repoSettings = readRepoSettings()

    if (isDryRun()) {
        console.log(
            `Firewall exceptions will be removed from the environment ${options.environmentName}`,
        )
    }

    return async () => {
        const publicIpv4 = await publicIp.v4()
        const config = await readConfigFromEnvFile(
            repoSettings.terraformStateType,
            options.environmentName,
        )
        if (!config) {
            console.warn('Skipped removing firewall rules, no terragrunt file for environment')
            return {
                success: true,
            }
        }
        const { resourceGroupName, terraformStorageAccount, keyVaultName } = config

        const kvOptions = options.removeIpFromKeyVaults || []
        const storageOptions = options.removeIpFromStorage || []
        await removeFirewallRules({
            resourceGroupName,
            removeIpFromKeyVaults: options.removeIpFromDefaultKeyVault
                ? [keyVaultName, ...kvOptions]
                : kvOptions,
            removeIpFromStorageAccounts:
                options.removeIpFromDefaultStorage && terraformStorageAccount
                    ? [terraformStorageAccount, ...storageOptions]
                    : storageOptions,
            publicIpv4,
        })

        console.log('🎉 Success 🎉')
    }
}
