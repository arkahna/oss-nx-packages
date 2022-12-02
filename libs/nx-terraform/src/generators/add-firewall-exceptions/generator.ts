import { Tree } from '@nrwl/devkit'
import publicIp from 'public-ip'
import { addFirewallRulesWithRetry } from '../../common/addFirewallRulesWithRetry'
import { isDryRun } from '../../common/isDryRun'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { NxTerraformAddFirewallExceptionsSchema } from './schema'

export default async function (_tree: Tree, options: NxTerraformAddFirewallExceptionsSchema) {
    const repoSettings = readRepoSettings()

    if (isDryRun()) {
        console.log(
            `Firewall exceptions will be added to the environment ${options.environmentName}`,
        )
    }

    return async () => {
        const publicIpv4 = await publicIp.v4()
        const config = await readConfigFromEnvFile(
            repoSettings.terraformStateType,
            options.environmentName,
            options.project,
        )
        if (!config) {
            console.warn('Skipped adding firewall rules, no terragrunt file for environment')
            return {
                success: true,
            }
        }
        const {
            resourceGroupName,
            terraformStorageAccount,
            keyVaultName,
            terragruntConfigFile,
            subscriptionId,
        } = config

        const kvOptions = options.addIpToKeyVaults || []
        const storageOptions = options.addIpToStorage || []
        await addFirewallRulesWithRetry({
            resourceGroupName,
            subscriptionId,
            addIpToKeyVaults: options.addIpToDefaultKeyVault
                ? [keyVaultName, ...kvOptions]
                : kvOptions,
            addIpToStorageAccounts:
                options.addIpToDefaultStorage && terraformStorageAccount
                    ? [terraformStorageAccount, ...storageOptions]
                    : storageOptions,
            publicIpv4,
            terragruntConfigFile,
            // This generator isn't tied to a project, so it doesn't support looking up tf resources
            projectRoot: process.cwd(),
            retryAttempts: options.firewallRetryAttempts,
            retryDelay: options.firewallRetryDelay,
        })
        console.log('🎉 Success 🎉')
    }
}
