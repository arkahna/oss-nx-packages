import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { LintExecutorSchema } from './schema'

export default async function runExecutor(
    _options: LintExecutorSchema,
    context: ExecutorContext
) {
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
        [
            'init',
            '--terragrunt-config',
            'vars/local/terragrunt.hcl',
            '-reconfigure',
        ],
        {
            stdio: [process.stdin, process.stdout, 'pipe'],
            cwd: projectRoot,
            env: {},
        }
    )

    await execa('terraform', ['fmt', '-check'], {
        stdio: [process.stdin, process.stdout, 'pipe'],
        cwd: projectRoot,
    })

    await execa('terraform', ['validate'], {
        stdio: [process.stdin, process.stdout, 'pipe'],
        cwd: projectRoot,
    })

    return {
        success: true,
    }
}
