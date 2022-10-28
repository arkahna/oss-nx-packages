import { ResourceManagementClient } from '@azure/arm-resources'
import { DefaultAzureCredential } from '@azure/identity'
import { setLogLevel } from '@azure/logger'
import { formatFiles, Tree } from '@nrwl/devkit'
import { getCurrentPrincipal } from '../../common/getCurrentPrincipal'
import { isDryRun } from '../../common/isDryRun'
import { readRepoSettings } from '../../common/read-repo-settings'
import { TerraformStateType } from '../../common/tf-state-types'
import { ensureKeyvaultExists } from './ensureKeyvaultExists'
import { ensureResourceGroupExists } from './ensureResourceGroupExists'
import { ensureResourceNameDefaults } from './ensureResourceNameDefaults'
import { ensureTfStorageAccountExists } from './ensureTfStorageAccountExists'
import { getEnvironmentsDir } from './getEnvironmentsDir'
import { NxTerraformAddEnvironmentSchema } from './schema'

export default async function (tree: Tree, options: NxTerraformAddEnvironmentSchema) {
    const {
        azureResourcePrefix,
        azureWorkloadName,
        azureWorkloadCode,
        terraformStateType,
        terraformCloudOrganization,
    } = readRepoSettings()
    if (options.azureLogLevel) {
        setLogLevel(options.azureLogLevel)
    }

    ensureResourceNameDefaults(options, azureResourcePrefix, azureWorkloadCode)

    const environmentsDir = getEnvironmentsDir(options.project) // 'docs/customers/{{project}}/environments'

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const resourceGroupName = options.resourceGroupName!
    const tfStorageAccountName = options.tfStorageAccountName!
    const tfWorkspaceName = options.tfWorkspaceName!
    const keyVaultName = options.keyVaultName!
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const tfStoreDetails =
        terraformStateType === 'azure-storage'
            ? `
tfstate_storage_account: ${tfStorageAccountName}
tfstate_container: ${options.containerName}`
            : `tf_workspace: ${tfWorkspaceName}
tf_workspace_link: https://app.terraform.io/app/${terraformCloudOrganization}/workspaces/${tfWorkspaceName}`

    tree.write(
        `${environmentsDir}/${options.environmentName}.md`,
        `---
subscription_id: ${options.subscriptionId}
tenant_id: ${options.tenantId}
resource_location: ${options.location}
resource_group_name: ${resourceGroupName}
keyvault_name: ${keyVaultName}
${tfStoreDetails}
---

# ${azureWorkloadName} ${options.environmentName} Environment
`,
    )
    await formatFiles(tree)

    if (isDryRun()) {
        if (options.skipEnvironmentCreation) {
            if (terraformStateType === 'azure-storage') {
                console.log(`The following resources will be created in ${options.location} for terraform storage:

                resource_group_name: ${resourceGroupName}
                ${tfStoreDetails}
                `)
            } else {
                console.log('Environment creation will be skipped')
            }
        } else {
            console.log(`The following resources will be created in ${options.location}:

resource_group_name: ${resourceGroupName}
keyvault_name: ${keyVaultName}
${tfStoreDetails}
`)
        }
    }

    return async () => {
        if (!options.location) {
            throw new Error('location is not defined to create specified resources')
        }

        const credentials = new DefaultAzureCredential()
        const currentPrincipal = await getCurrentPrincipal(credentials)

        const rm = new ResourceManagementClient(credentials, options.subscriptionId)
        const tags = {
            environment: options.environmentName,
        }

        if (!options.skipEnvironmentCreation || terraformStateType === 'azure-storage') {
            await ensureResourceGroupExists(resourceGroupName, rm, options.location)
        }

        // First setup TF state store
        await createWorkloadEnvironmentStorage(
            rm,
            terraformStateType,
            options,
            resourceGroupName,
            tfStorageAccountName,
            currentPrincipal,
            tags,
        )

        if (options.skipEnvironmentCreation) {
            return
        }

        await ensureKeyvaultExists(
            rm,
            options.subscriptionId,
            resourceGroupName,
            keyVaultName,
            options.tenantId,
            options.location,
            currentPrincipal,
            options.environmentName,
            tags,
        )

        console.log()
        console.log()
        console.log(
            `🎉 Successfully created environment ${options.environmentName} for workload ${azureWorkloadCode} 🎉`,
        )
        console.log('Subscription is', options.subscriptionId)
        console.log('AAD Tenant ID is', options.tenantId)

        console.log('Resource group for environment is', options.resourceGroupName)
        console.log('KeyVault account for workload environment is', options.keyVaultName)
    }
}

async function createWorkloadEnvironmentStorage(
    rm: ResourceManagementClient,
    terraformStateType: TerraformStateType,
    options: NxTerraformAddEnvironmentSchema,
    resourceGroupName: string,
    tfStorageAccountName: string,
    currentPrincipal: string,
    tags: Record<string, string>,
) {
    if (terraformStateType === 'azure-storage') {
        await ensureTfStorageAccountExists(
            options.subscriptionId,
            options.environmentName,
            tfStorageAccountName,
            options.containerName,
            rm,
            resourceGroupName,
            options.location,
            currentPrincipal,
            tags,
        )
    }
}
