import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import publicIp from 'public-ip'
import { addFirewallRulesWithRetry } from '../../common/addFirewallRulesWithRetry'
import { createTerragruntCliArgs } from '../../common/createTerragruntCliArgs'
import { getCurrentAzAccount } from '../../common/getCurrentAzAccount'
import { getTfEnvVars } from '../../common/getEnvTfVars'
import { initEnvironmentWorkspaceWithFirewallRuleRetry } from '../../common/initEnvironmentWorkspaceWithRetry'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { removeFirewallRules } from '../../common/removeFirewallRules'
import { OutputExecutorSchema } from './schema'

export default async function runExecutor(options: OutputExecutorSchema, context: ExecutorContext) {
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
    const config = await readConfigFromEnvFile(repoConfig.terraformStateType, options.environment)
    if (!config) {
        console.warn('Skipped output command, no terragrunt file for environment')
        return {
            success: true,
        }
    }
    const { resourceGroupName, terraformStorageAccount, terragruntConfigFile, subscriptionId } =
        config

    const currentAccount = await getCurrentAzAccount()

    if (subscriptionId !== currentAccount.id) {
        console.error(
            'Error: subscriptionId does not match currently selected account, run the following to fix:',
        )
        console.info(`> az account set --subscription ${subscriptionId}`)

        return {
            success: false,
        }
    }

    const { keyVaultsToRemoveFirewallRules, storageAccountsToRemoveFirewallRules } =
        await addFirewallRulesWithRetry({
            resourceGroupName,
            addIpToKeyVaults: [],
            addIpToStorageAccounts:
                options.addIpToDefaultStorage && terraformStorageAccount
                    ? [terraformStorageAccount]
                    : [],
            publicIpv4,
            terragruntConfigFile,
            projectRoot,
            retryAttempts: options.firewallRetryAttempts,
            retryDelay: options.firewallRetryDelay,
        })

    try {
        const terragruntCliArgs = createTerragruntCliArgs([
            ...getTfEnvVars(context.projectName, config, repoConfig),
        ])

        await initEnvironmentWorkspaceWithFirewallRuleRetry({
            terragruntConfigFile,
            terragruntCliArgs,
            projectRoot,
            retryAttempts: options.firewallRetryAttempts,
            retryDelay: options.firewallRetryDelay,
            quiet: true,
        })

        const terragruntOutputArgs = [
            'output',
            ...(options.name ? [options.name] : []),
            '--terragrunt-config',
            terragruntConfigFile,
            ...(options.json ? ['-json'] : []),
        ]

        await execa('terragrunt', terragruntOutputArgs, {
            cwd: projectRoot,
            stdio: 'inherit',
        })
    } finally {
        await removeFirewallRules({
            resourceGroupName,
            removeIpFromKeyVaults: keyVaultsToRemoveFirewallRules,
            removeIpFromStorageAccounts: storageAccountsToRemoveFirewallRules,
            publicIpv4,
        })
    }

    return {
        success: true,
    }
}
