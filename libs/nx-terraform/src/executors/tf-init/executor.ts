import { ExecutorContext } from '@nrwl/devkit'
import publicIp from 'public-ip'
import { addFirewallRules } from '../../common/addFirewallRules'
import { ensureNoBackendFile } from '../../common/ensure-no-backend-file'
import { initEnvironmentWorkspaceWithFirewallRuleRetry } from '../../common/initEnvironmentWorkspaceWithRetry'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { removeFirewallRules } from '../../common/removeFirewallRules'
import { InitExecutorSchema } from './schema'

export default async function runExecutor(options: InitExecutorSchema, context: ExecutorContext) {
    const publicIpv4 = await publicIp.v4()
    if (!context.projectName) {
        throw new Error('No projectName')
    }

    const repoConfig = readRepoSettings()
    const projectRoot = context.workspace.projects[context.projectName]?.root

    if (!projectRoot) {
        console.error(`Error: Cannot find root for ${context.projectName}.`)
        return {
            success: false,
        }
    }

    if (!options.environment) {
        ensureNoBackendFile(projectRoot)

        await initEnvironmentWorkspaceWithFirewallRuleRetry({
            terragruntConfigFile: 'vars/local/terragrunt.hcl',
            terragruntCliArgs: [],
            projectRoot,
            upgrade: options.upgrade,
            migrateState: options.migrateState,
            reconfigure: options.reconfigure,
            // These are not used because we will not hit firewall issues with local
            retryAttempts: 3,
            retryDelay: 5,
        })
    } else {
        const config = await readConfigFromEnvFile(
            repoConfig.terraformStateType,
            options.environment,
        )
        if (!config) {
            console.warn('Skipped apply, no terragrunt file for environment')
            return {
                success: true,
            }
        }
        const { resourceGroupName, terraformStorageAccount, terragruntConfigFile } = config

        const { keyVaultsToRemoveFirewallRules, storageAccountsToRemoveFirewallRules } =
            await addFirewallRules({
                resourceGroupName,
                addIpToKeyVaults: [],
                addIpToStorageAccounts:
                    options.addIpToDefaultStorage && terraformStorageAccount
                        ? [terraformStorageAccount]
                        : [],
                publicIpv4,
                terragruntConfigFile,
                projectRoot,
            })

        try {
            await initEnvironmentWorkspaceWithFirewallRuleRetry({
                terragruntConfigFile,
                terragruntCliArgs: [],
                projectRoot,
                upgrade: options.upgrade,
                migrateState: options.migrateState,
                reconfigure: options.reconfigure,
                retryAttempts: options.firewallRetryAttempts,
                retryDelay: options.firewallRetryDelay,
            })
        } finally {
            await removeFirewallRules({
                resourceGroupName,
                removeIpFromKeyVaults: keyVaultsToRemoveFirewallRules,
                removeIpFromStorageAccounts: storageAccountsToRemoveFirewallRules,
                publicIpv4,
            })
        }
    }

    return {
        success: true,
    }
}
