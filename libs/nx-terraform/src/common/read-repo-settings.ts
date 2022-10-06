import fs from 'node:fs'

export type RepoSettings = ReturnType<typeof readRepoSettings>

export function readRepoSettings() {
    const packageJson = fs.readFileSync('package.json').toString()

    const {
        terraformCloudOrganization,
        azureResourcePrefix,
        terraformStateType,
        azureWorkloadName,
        azureWorkloadCode,
        azureCostCentre,
        owner,
        author,
    } = JSON.parse(packageJson)

    if (!azureResourcePrefix) {
        throw new Error(
            'azureResourcePrefix is not defined in root package.json, run pnpm nx g @arkahna/nx-terraform:init'
        )
    }
    if (!['terraform-cloud', 'azure-storage'].includes(terraformStateType)) {
        throw new Error(
            'terraformStateType is not defined in root package.json or is not one of terraform-cloud, azure-storage, run pnpm nx g @arkahna/nx-terraform:init'
        )
    }

    return {
        terraformCloudOrganization: terraformCloudOrganization as string,
        azureResourcePrefix: azureResourcePrefix as string,
        terraformStateType: terraformStateType as
            | 'terraform-cloud'
            | 'azure-storage',
        azureWorkloadName: azureWorkloadName as string,
        azureWorkloadCode: azureWorkloadCode as string,
        owner: owner as string,
        author: author as string,
        azureCostCentre: azureCostCentre as string,
    }
}
