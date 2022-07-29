import execa from 'execa'

export async function getTfResourceName(
    terragruntConfigFile: string,
    resourceAddress: string,
    projectRoot: string,
) {
    try {
        const outputJson = await execa(
            'terragrunt',
            [
                'state',
                'show',
                '--terragrunt-config',
                terragruntConfigFile,
                resourceAddress,
                '-json',
            ],
            {
                stdio: [process.stdin, 'pipe', 'pipe'],
                cwd: projectRoot,
            },
        )

        const output = JSON.parse(outputJson.stdout)
        resourceAddress = output.name
        return resourceAddress
    } catch (err) {
        console.log('Failed to look up resource name', err)
        return
    }
}
