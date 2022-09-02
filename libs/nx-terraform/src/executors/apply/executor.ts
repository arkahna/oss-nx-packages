import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { getEscapedCommand } from 'execa/lib/command'
import publicIp from 'public-ip'
import { addFirewallRulesWithRetry } from '../../common/addFirewallRulesWithRetry'
import { createTerragruntCliArgs } from '../../common/createTerragruntCliArgs'
import { getCurrentAzAccount } from '../../common/getCurrentAzAccount'
import { getTfEnvVars } from '../../common/getEnvTfVars'
import { initEnvironmentWorkspaceWithFirewallRuleRetry } from '../../common/initEnvironmentWorkspaceWithRetry'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { removeFirewallRules } from '../../common/removeFirewallRules'
import { ApplyExecutorSchema } from './schema'

export default async function runExecutor(options: ApplyExecutorSchema, context: ExecutorContext) {
    const publicIpv4 = await publicIp.v4()
    const projectName = context.projectName
    if (!projectName) {
        throw new Error('No projectName')
    }

    const projectRoot = context.workspace.projects[projectName]?.root

    if (!projectRoot) {
        console.error(`Error: Cannot find root for ${projectName}.`)
        return {
            success: false,
        }
    }

    const repoConfig = readRepoSettings()

    const config = await readConfigFromEnvFile(repoConfig.terraformStateType, options.environment)

    if (!config) {
        console.warn('Skipped apply, no terragrunt file for environment')
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

    const kvOptions = options.addIpToKeyVaults || []
    const storageOptions = options.addIpToStorage || []
    const { keyVaultsToRemoveFirewallRules, storageAccountsToRemoveFirewallRules } =
        await addFirewallRulesWithRetry({
            resourceGroupName,
            addIpToKeyVaults: options.addIpToDefaultKeyVault
                ? [keyVaultName, ...kvOptions]
                : kvOptions,
            addIpToStorageAccounts:
                options.addIpToDefaultStorage && terraformStorageAccount
                    ? [terraformStorageAccount, ...storageOptions]
                    : storageOptions,
            publicIpv4,
            terragruntConfigFile,
            projectRoot,
            retryAttempts: options.firewallRetryAttempts,
            retryDelay: options.firewallRetryDelay,
        })

    const terragruntCliArgs = createTerragruntCliArgs([
        ...(options.var || []),
        ...getTfEnvVars(projectName, config, repoConfig),
    ])
    const terragruntArguments = [
        'apply',
        // Only auto approve apply, not destroy
        '-auto-approve',
        '--terragrunt-config',
        terragruntConfigFile,
        ...terragruntCliArgs,
        ...(options.tfTarget ? ['-target', options.tfTarget] : []),
        ...(options.quick ? ['-refresh=false'] : []),
    ]

    try {
        if (!options.quick) {
            await initEnvironmentWorkspaceWithFirewallRuleRetry({
                terragruntConfigFile,
                terragruntCliArgs,
                projectRoot,
                retryAttempts: options.firewallRetryAttempts,
                retryDelay: options.firewallRetryDelay,
            })
        }

        console.log(`${projectRoot}> ${getEscapedCommand(`terragrunt`, terragruntArguments)}`)
        await execa('terragrunt', terragruntArguments, {
            stdio: 'inherit',
            cwd: projectRoot,
        })
    } finally {
        if (options.leaveFirewallExceptions !== true) {
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
