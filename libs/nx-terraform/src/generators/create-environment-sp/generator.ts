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
    const appIdPlaceholder = 'APP_ID_ONCE_CREATED'
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

    const assignApplicationWritePermissions = [
        'ad',
        'app',
        'permission',
        'add',
        '--id',
        appIdPlaceholder,
        '--api',
        // Graph
        '00000002-0000-0000-c000-000000000000',
        '--api-permissions',
        // Application.ReadWrite.OwnedBy
        '824c81eb-e3f8-4ee6-8f6d-de7f50d565b7=Role',
    ]

    if (isDryRun()) {
        console.log('Will run:')

        console.log(`> ${getEscapedCommand(`az`, createServicePrincipalArgs)}`)

        if (repoSettings.terraformStateType === 'azure-storage') {
            console.log(`> ${getEscapedCommand(`az`, storageContributorRoleAssignmentArgs)}`)
        }

        console.log(`> ${getEscapedCommand(`az`, keyvaultRoleAssignmentArgs)}`)

        console.log(`> ${getEscapedCommand(`az`, assignApplicationWritePermissions)}`)
    }

    return async () => {
        await ensureLoggedIntoCorrectTenant(environmentConfig.tenantId)
        console.log(`> ${getEscapedCommand(`az`, createServicePrincipalArgs)}`)
        await execa(`az`, createServicePrincipalArgs, {
            stdio: 'inherit',
        })

        const { stdout: stdoutAdList } = await execa(`az`, [
            'ad',
            'sp',
            'list',
            '--display-name',
            servicePrincipalName,
        ])
        const servicePrincipalObjectId: string = JSON.parse(stdoutAdList)[0].id
        console.log(`Service principal id: ${servicePrincipalObjectId}`)

        const { stdout: stdoutAppList } = await execa(`az`, [
            'ad',
            'app',
            'list',
            '--display-name',
            servicePrincipalName,
        ])
        const appObjectId: string = JSON.parse(stdoutAppList)[0].id
        const appClientId: string = JSON.parse(stdoutAppList)[0].appId
        console.log(`Service principal app object id: ${appObjectId}`)
        console.log(`Service principal app client id: ${appClientId}`)

        const newAttributes: Record<string, string | undefined> = {
            ...environmentConfig.attributes,
            github_service_principal_name: servicePrincipalName,
            github_service_principal_id: servicePrincipalObjectId,
            github_service_principal_app_object_id: appObjectId,
            github_service_principal_app_client_id: appClientId,
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

        console.log()
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

        console.log(`> ${getEscapedCommand(`az`, assignApplicationWritePermissions)}`)
        await execa(
            'az',
            assignApplicationWritePermissions.map((arg) =>
                arg === appIdPlaceholder ? appObjectId : arg,
            ),
            {
                stdio: 'inherit',
            },
        )

        console.log(
            `Application link: https://portal.azure.com/?feature.msaljs=false#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${appClientId}/isMSAApp~/false`,
        )
        console.log(
            `Consent link: https://login.microsoftonline.com/${environmentConfig.tenantId}/adminconsent?client_id=${appClientId}`,
        )

        console.log(`🎉 Success 🎉`)
        console.log(
            `🎉 Ensure you copy the credentials, the secret will not be stored in ${environmentConfig.environmentFile} 🎉`,
        )
    }
}
