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
    quiet,
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

    quiet?: boolean
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

    if (!quiet) {
        console.log(`${projectRoot}> ${getEscapedCommand(`terragrunt`, terragruntArgs)}`)
    }

    // We can't inherit stdio here, as the retry function needs to see the output
    const { all } = await retryOnFirewallError(
        async () =>
            await execa('terragrunt', terragruntArgs, {
                all: true,
                cwd: projectRoot,
            }),
        {
            retryAttempts,
            retryDelay,
        },
    )
    if (!quiet) {
        console.log(all)
    }
}
