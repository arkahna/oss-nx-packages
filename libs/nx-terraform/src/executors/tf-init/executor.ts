import { ExecutorContext } from '@nrwl/devkit'
import { ensureNoBackendFile } from '../../common/ensure-no-backend-file'
import { initEnvironmentWorkspaceWithFirewallRuleRetry } from '../../common/initEnvironmentWorkspaceWithRetry'
import { InitExecutorSchema } from './schema'

export default async function runExecutor(options: InitExecutorSchema, context: ExecutorContext) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }

    const projectRoot = context.workspace.projects[context.projectName]?.root

    if (!projectRoot) {
        console.error(`Error: Cannot find root for ${context.projectName}.`)
        return {
            success: false,
        }
    }
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

    return {
        success: true,
    }
}
