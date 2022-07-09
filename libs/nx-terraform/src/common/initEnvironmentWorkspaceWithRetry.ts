import execa from 'execa'
import { getEscapedCommand } from 'execa/lib/command'
import { retryOnFirewallError } from './retryOnFirewallError'

export async function initEnvironmentWorkspaceWithFirewallRuleRetry({
    terragruntConfigFile,
    terragruntCliArgs,
    projectRoot,
    upgrade,
    reconfigure,
    migrateState,
    retryAttempts,
    retryDelay,
}: {
    terragruntConfigFile: string
    terragruntCliArgs: string[]
    projectRoot: string
    upgrade?: boolean
    reconfigure?: boolean
    migrateState?: boolean
    retryAttempts: number
    /** Retry delay, in seconds */
    retryDelay: number
}) {
    const terragruntArgs = [
        'init',
        '--terragrunt-config',
        terragruntConfigFile,
        ...terragruntCliArgs,
        ...(upgrade ? ['-upgrade'] : []),
        ...(reconfigure ? ['-reconfigure'] : []),
        ...(migrateState ? ['-migrate-state'] : []),
    ]

    console.log(
        `${projectRoot}> ${getEscapedCommand(`terragrunt`, terragruntArgs)}`
    )

    return await retryOnFirewallError(
        () =>
            execa('terragrunt', terragruntArgs, {
                stdio: [process.stdin, process.stdout, 'pipe'],
                cwd: projectRoot,
            }),
        {
            retryAttempts,
            retryDelay,
        }
    )
}
