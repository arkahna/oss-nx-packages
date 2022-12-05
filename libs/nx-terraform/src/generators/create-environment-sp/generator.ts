import { Tree } from '@nrwl/devkit'
import execa from 'execa'
import { getEscapedCommand } from 'execa/lib/command'
import fs from 'node:fs'
import { ensureLoggedIntoCorrectTenant } from '../../common/ensureLoggedIntoCorrectTenant'
import { isDryRun } from '../../common/isDryRun'
import { readRepoSettings } from '../../common/read-repo-settings'
import { readConfigFromEnvFile } from '../../common/readConfigFromEnvFile'
import { NxTerraformCreateEnvironmentServicePrincipalSchema } from './schema'

export default async function (
    tree: Tree,
    options: NxTerraformCreateEnvironmentServicePrincipalSchema,
) {
    const repoSettings = readRepoSettings()
    const environmentConfig = await readConfigFromEnvFile(
        repoSettings.terraformStateType,
        options.environmentName,
        options.project,
    )

    const servicePrincipalName =
        options.name ??
        `gh-actions-${repoSettings.azureResourcePrefix}-${options.environmentName}-${repoSettings.azureWorkloadCode}-sp`
    const scopes = `/subscriptions/${environmentConfig.subscriptionId}/resourcegroups/${environmentConfig.resourceGroupName}`
    const containerScope = `/subscriptions/${environmentConfig.subscriptionId}/resourceGroups/${environmentConfig.resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${environmentConfig.terraformStorageAccount}/blobServices/default/containers/${environmentConfig.terraformStorageContainer}`
    const kvScope = `/subscriptions/${environmentConfig.subscriptionId}/resourceGroups/${environmentConfig.resourceGroupName}/providers/Microsoft.KeyVault/vaults/${environmentConfig.keyVaultName}`

    const createServicePrincipalArgs = [
        'ad',
        'sp',
        'create-for-rbac',
        '--role',
        options.role,
        '--scopes',
        scopes,
        `--name`,
        servicePrincipalName,
        `--sdk-auth`,
    ]

    const idPlaceholder = 'ID_ONCE_CREATED'
    const storageContributorRoleAssignmentArgs = [
        'role',
        'assignment',
        'create',
        '--role',
        'Storage Blob Data Contributor',
        '--assignee',
        idPlaceholder,
        '--scope',
        containerScope,
    ]

    const keyvaultRoleAssignmentArgs = [
        'role',
        'assignment',
        'create',
        '--role',
        'Key Vault Secrets Officer',
        '--assignee',
        idPlaceholder,
        '--scope',
        kvScope,
    ]

    if (isDryRun()) {
        console.log('Will run:')

        console.log(`> ${getEscapedCommand(`az`, createServicePrincipalArgs)}`)

        if (repoSettings.terraformStateType === 'azure-storage') {
            console.log(`> ${getEscapedCommand(`az`, storageContributorRoleAssignmentArgs)}`)
        }

        console.log(`> ${getEscapedCommand(`az`, keyvaultRoleAssignmentArgs)}`)
    }

    return async () => {
        await ensureLoggedIntoCorrectTenant(environmentConfig.tenantId)
        console.log(`> ${getEscapedCommand(`az`, createServicePrincipalArgs)}`)
        await execa(`az`, createServicePrincipalArgs, {
            stdio: 'inherit',
        })

        const { stdout } = await execa(`az`, [
            'ad',
            'sp',
            'list',
            '--display-name',
            servicePrincipalName,
        ])
        const servicePrincipalObjectId: string = JSON.parse(stdout)[0].id
        console.log(`Service principal id: ${servicePrincipalObjectId}`)

        const newAttributes: Record<string, string | undefined> = {
            ...environmentConfig.attributes,
            github_service_principal: servicePrincipalName,
            github_service_principal_id: servicePrincipalObjectId,
        }

        fs.writeFileSync(
            environmentConfig.environmentFile,
            `---
${Object.keys(newAttributes)
    .map((key) => `${key}: ${newAttributes[key] || ''}`)
    .join('\n')}
---

${environmentConfig.environmentFileBody}
`,
        )

        if (repoSettings.terraformStateType === 'azure-storage') {
            console.log(`> ${getEscapedCommand(`az`, storageContributorRoleAssignmentArgs)}`)
            await execa(
                'az',
                storageContributorRoleAssignmentArgs.map((arg) =>
                    arg === idPlaceholder ? servicePrincipalObjectId : arg,
                ),
                {
                    stdio: 'inherit',
                },
            )
        }

        console.log(`> ${getEscapedCommand(`az`, keyvaultRoleAssignmentArgs)}`)
        await execa(
            'az',
            keyvaultRoleAssignmentArgs.map((arg) =>
                arg === idPlaceholder ? servicePrincipalObjectId : arg,
            ),
            {
                stdio: 'inherit',
            },
        )

        console.log(`🎉 Success 🎉`)
        console.log(
            `🎉 Ensure you copy the credentials, the secret will not be stored in ${environmentConfig.environmentFile} 🎉`,
        )
    }
}
