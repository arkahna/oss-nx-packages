import { readNxJson } from '@nrwl/devkit'

export function getEnvironmentsDir(projectName: string | undefined) {
    const nxJson = readNxJson()
    const environmentsDir =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (nxJson.workspaceLayout as any)?.['nx-terraform']?.environmentsDirectory ||
        'docs/environments'

    if (projectName) {
        return environmentsDir.replace('{project}', projectName)
    }

    return projectName
}
