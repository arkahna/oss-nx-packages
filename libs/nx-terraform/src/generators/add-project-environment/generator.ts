import {
    formatFiles,
    generateFiles,
    ProjectConfiguration,
    readProjectConfiguration,
    Tree,
} from '@nrwl/devkit'
import fetch from 'node-fetch'
import { readFile } from 'node:fs/promises'
import * as path from 'path'
import { readRepoSettings, RepoSettings } from '../../common/read-repo-settings'
import { EnvConfig, readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { NxTerraformAddEnvironmentSchema } from './schema'

function addFiles(
    tree: Tree,
    stateFilename: string,
    targetProjectConfig: ProjectConfiguration,
    {
        keyVaultName,
        resourceGroupName,
        tenantId,
        subscriptionId,
        terraformStorageAccount,
        terraformStorageContainer,
        terraformCloudWorkspaceName,
        resourceLocation,
    }: EnvConfig,
    repoSettings: RepoSettings,
    { environmentName }: NxTerraformAddEnvironmentSchema,
) {
    const templateOptions = {
        subscriptionId,
        tenantId,
        environmentName,
        storageKey: stateFilename,
        storageAccountName: terraformStorageAccount,
        containerName: terraformStorageContainer,
        organizationName: repoSettings.terraformCloudOrganization,
        workspaceName: terraformCloudWorkspaceName,
        location: resourceLocation,
        resourceGroupName,
        keyVaultName,
    }

    generateFiles(
        tree,
        path.join(__dirname, 'state-type', repoSettings.terraformStateType),
        path.join(targetProjectConfig.root, 'vars', environmentName),
        templateOptions,
    )
}

export default async function (tree: Tree, options: NxTerraformAddEnvironmentSchema) {
    const repoSettings = readRepoSettings()
    const targetProjectConfig = readProjectConfiguration(tree, options.projectName)
    const environmentConfig = await readConfigFromEnvFile(
        repoSettings.terraformStateType,
        options.environmentName,
        options.projectName,
    )

    const tfProjectName = `${options.projectName.replace(`-infra`, '')}.tfstate`

    addFiles(tree, tfProjectName, targetProjectConfig, environmentConfig, repoSettings, options)
    await formatFiles(tree)

    return async () => {
        if (repoSettings.terraformStateType === 'terraform-cloud') {
            const workspaceName = `${tfProjectName}-${options.environmentName}`
            console.log(`Creating Terraform Cloud workspace ${workspaceName}`)

            await createTerraformWorkspace(repoSettings.terraformCloudOrganization, workspaceName)
        }
        console.log('🎉 Success 🎉')
    }
}

async function createTerraformWorkspace(
    terraformCloudOrganization: string,
    tfWorkspaceName: string,
) {
    const homeDir = process.env.APPDATA || process.env.HOME
    if (!homeDir) {
        throw new Error('Could not find home directory')
    }
    const terraformCredentials = path.join(homeDir, '.terraform.d', 'credentials.tfrc.json')
    const credFile = await readFile(terraformCredentials)
    const creds = JSON.parse(credFile.toString())
    const token = creds?.credentials['app.terraform.io']?.token
    if (!token) {
        throw new Error(
            `Cannot locate credentials at ${terraformCredentials}, ensure you have run 'terraform login'`,
        )
    }

    const createWorkspaceResponse = await fetch(
        `https://app.terraform.io/api/v2/organizations/${terraformCloudOrganization}/workspaces`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify({
                data: {
                    type: 'workspaces',
                    attributes: {
                        name: tfWorkspaceName,
                        execution_mode: 'local',
                    },
                },
            }),
        },
    )

    if (!createWorkspaceResponse.ok) {
        const response = await createWorkspaceResponse.text()
        throw new Error(`Failed to create workspace ${tfWorkspaceName}: ${response}`)
    }
}
