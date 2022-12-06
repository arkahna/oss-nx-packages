import { readEnvironmentFile } from './readEnvironmentFile'
import { TerraformStateType } from './tf-state-types'

export type EnvConfig = Awaited<ReturnType<typeof readConfigFromEnvFile>>

export async function readConfigFromEnvFile(
    terraformStateType: TerraformStateType,
    environment: string,
    project?: string,
) {
    const terragruntConfigFile = `vars/${environment}/terragrunt.hcl`

    const { attributes, environmentFile, body } = await readEnvironmentFile(environment, project)

    if (!attributes.subscription_id) {
        throw new Error(
            `Missing subscription_id in environment documentation markdown file at ${environmentFile}`,
        )
    }
    if (!attributes.tenant_id) {
        throw new Error(
            `Missing tenant_id in environment documentation markdown file at ${environmentFile}`,
        )
    }
    if (!attributes.resource_location) {
        throw new Error(
            `Missing resource_location in environment documentation markdown file at ${environmentFile}`,
        )
    }
    if (!attributes.resource_group_name) {
        throw new Error(
            `Missing resource_group_name in environment documentation markdown file at ${environmentFile}`,
        )
    }
    if (!attributes.keyvault_name) {
        throw new Error(
            `Missing keyvault_name in environment documentation markdown file at ${environmentFile}`,
        )
    }

    if (terraformStateType === 'azure-storage' && !attributes.tfstate_storage_account) {
        throw new Error(
            `Missing tfstate_storage_account in environment documentation markdown file at ${environmentFile}`,
        )
    }

    if (terraformStateType === 'azure-storage' && !attributes.tfstate_container) {
        throw new Error(
            `Missing tfstate_container in environment documentation markdown file at ${environmentFile}`,
        )
    }

    if (terraformStateType === 'terraform-cloud' && !attributes.tf_workspace) {
        throw new Error(
            `Missing tf_workspace in environment documentation markdown file at ${environmentFile}`,
        )
    }

    return {
        environment,
        subscriptionId: attributes.subscription_id,
        tenantId: attributes.tenant_id,
        resourceGroupName: attributes.resource_group_name,
        resourceLocation: attributes.resource_location,
        terraformStorageAccount: attributes.tfstate_storage_account,
        terraformStorageContainer: attributes.tfstate_container,
        keyVaultName: attributes.keyvault_name,
        environmentMarkdownFilePath: environmentFile,
        environmentAttributes: attributes,
        terragruntConfigFile,
        terraformCloudWorkspaceName: attributes.tf_workspace,
        environmentFile,
        attributes,
        environmentFileBody: body,
        github_service_principal_name: attributes.github_service_principal_name,
        github_service_principal_id: attributes.github_service_principal_id,
        github_service_principal_app_object_id: attributes.github_service_principal_app_object_id,
        github_service_principal_app_client_id: attributes.github_service_principal_app_client_id,
    }
}
