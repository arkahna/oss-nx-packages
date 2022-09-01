import execa from 'execa'

export async function getTfResourceName(
    terragruntConfigFile: string,
    resourceAddress: string,
    projectRoot: string,
) {
    try {
        const outputHcl = await execa(
            'terragrunt',
            [
                'state',
                'show',
                '--terragrunt-config',
                terragruntConfigFile,
                resourceAddress,
                '-no-color',
            ],
            {
                stdio: [process.stdin, 'pipe', 'pipe'],
                cwd: projectRoot,
            },
        )

        const match = outputHcl.stdout.match(/.{4}name\s+=\s"([a-z]+)"/)
        if (!match || !match[1]) {
            throw 'could not find match in returned hcl'
        }

        resourceAddress = match[1]
        return resourceAddress
    } catch (err) {
        console.log('Failed to look up resource name', err)
        return
    }
}
