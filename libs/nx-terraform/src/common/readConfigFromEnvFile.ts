import { workspaceRoot } from '@nrwl/devkit'
import fm from 'front-matter'
import * as fs from 'fs'
import { readFile } from 'fs/promises'
import * as path from 'path'
import { TerraformStateType } from './tf-state-types'

export type EnvConfig = Awaited<ReturnType<typeof readConfigFromEnvFile>>

export async function readConfigFromEnvFile(
    terraformStateType: TerraformStateType,
    environment: string
) {
    const terragruntConfigFile = `vars/${environment}/terragrunt.hcl`

    const environmentFile = path.join(
        workspaceRoot,
        `docs/environments/${environment}.md`
    )

    if (!fs.existsSync(environmentFile)) {
        throw new Error(
            `Missing environment documentation markdown file at ${environmentFile}`
        )
    }
    const environmentMarkdown = await readFile(environmentFile)
    const frontMatter = fm(environmentMarkdown.toString())

    if (!frontMatter.attributes || typeof frontMatter.attributes !== 'object') {
        throw new Error(
            `Missing front matter in environment documentation markdown file at ${environmentFile}`
        )
    }
    const attributes = frontMatter.attributes as Record<
        string,
        string | undefined
    >

    if (!attributes.subscription_id) {
        throw new Error(
            `Missing subscription_id in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.tenant_id) {
        throw new Error(
            `Missing tenant_id in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.resource_location) {
        throw new Error(
            `Missing resource_location in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.resource_group_name) {
        throw new Error(
            `Missing resource_group_name in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.keyvault_name) {
        throw new Error(
            `Missing keyvault_name in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.vnet_name) {
        throw new Error(
            `Missing vnet_name in environment documentation markdown file at ${environmentFile}`
        )
    }
    if (!attributes.subnet_name) {
        throw new Error(
            `Missing subnet_name in environment documentation markdown file at ${environmentFile}`
        )
    }

    if (
        terraformStateType === 'azure-storage' &&
        !attributes.tfstate_storage_account
    ) {
        throw new Error(
            `Missing tfstate_storage_account in environment documentation markdown file at ${environmentFile}`
        )
    }

    if (
        terraformStateType === 'azure-storage' &&
        !attributes.tfstate_container
    ) {
        throw new Error(
            `Missing tfstate_container in environment documentation markdown file at ${environmentFile}`
        )
    }

    if (terraformStateType === 'terraform-cloud' && !attributes.tf_workspace) {
        throw new Error(
            `Missing tf_workspace in environment documentation markdown file at ${environmentFile}`
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
        vnetName: attributes.vnet_name,
        subnetName: attributes.subnet_name,
        environmentMarkdownFilePath: environmentFile,
        environmentAttributes: attributes,
        terragruntConfigFile,
        terraformCloudWorkspaceName: attributes.tf_workspace,
    }
}
