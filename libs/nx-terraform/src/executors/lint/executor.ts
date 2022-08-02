import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { LintExecutorSchema } from './schema'

export default async function runExecutor(options: LintExecutorSchema, context: ExecutorContext) {
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

    await execa(
        'terragrunt',
        ['init', '--terragrunt-config', 'vars/local/terragrunt.hcl', '-reconfigure'],
        {
            stdio: 'inherit',
            cwd: projectRoot,
            env: {},
        },
    )

    await execa('terraform', ['fmt', '-check'], {
        stdio: 'inherit',
        cwd: projectRoot,
    })

    await execa('terraform', ['validate'], {
        stdio: 'inherit',
        cwd: projectRoot,
    })

    if (options.tfsec) {
        await execa('tfsec', [projectRoot], {
            stdio: 'inherit',
            env: {},
        })
    }

    return {
        success: true,
    }
}
