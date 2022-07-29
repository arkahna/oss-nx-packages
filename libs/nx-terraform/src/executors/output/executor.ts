import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { getEscapedCommand } from 'execa/lib/command'
import publicIp from 'public-ip'
import { addFirewallRules } from '../../common/addFirewallRules'
import { createTerragruntCliArgs } from '../../common/createTerragruntCliArgs'
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
        const terragruntCliArgs = createTerragruntCliArgs([
            ...getTfEnvVars(context.projectName, config, repoConfig),
        ])

        await initEnvironmentWorkspaceWithFirewallRuleRetry({
            terragruntConfigFile,
            terragruntCliArgs,
            projectRoot,
            retryAttempts: options.firewallRetryAttempts,
            retryDelay: options.firewallRetryDelay,
        })

        const terragruntOutputArgs = [
            'output',
            ...(options.name ? [options.name] : []),
            '--terragrunt-config',
            terragruntConfigFile,
            ...(options.json ? ['-json'] : []),
        ]

        console.log(`${projectRoot}> ${getEscapedCommand(`terragrunt`, terragruntOutputArgs)}`)
        await execa('terragrunt', terragruntOutputArgs, {
            stdio: [process.stdin, 'pipe', 'pipe'],
            cwd: projectRoot,
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
