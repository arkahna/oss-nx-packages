import { Tree } from '@nrwl/devkit'
import execa from 'execa'
import { getEscapedCommand } from 'execa/lib/command'
import fs from 'node:fs'
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
    )

    const servicePrincipalName =
        options.name ??
        `gh-actions-${repoSettings.azureResourcePrefix}-${options.environmentName}-sp`
    const scopes = `/subscriptions/${environmentConfig.subscriptionId}/resourcegroups/${environmentConfig.resourceGroupName}`
    const containerScope = `/subscriptions/${environmentConfig.subscriptionId}/resourceGroups/${environmentConfig.resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${environmentConfig.terraformStorageAccount}/blobServices/default/containers/${environmentConfig.terraformStorageContainer}`

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

    if (isDryRun()) {
        console.log('Will run:')

        console.log(`> ${getEscapedCommand(`az`, createServicePrincipalArgs)}`)

        if (repoSettings.terraformStateType === 'azure-storage') {
            console.log(`> ${getEscapedCommand(`az`, storageContributorRoleAssignmentArgs)}`)
        }
    }

    return async () => {
        console.log('Ensuring logged in to correct tenant')
        const { stdout: accountShowStdOut } = await execa(`az`, ['account', 'show'])
        const accountShow = JSON.parse(accountShowStdOut)
        if (accountShow.tenantId !== environmentConfig.tenantId) {
            console.log(
                'Current subscription belongs to wrong Tenant, select the correct subscription using:',
            )
            console.log(`> az account set --subscription ${environmentConfig.subscriptionId}`)

            throw new Error('Tenant id does not match')
        }

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
        const servicePrincipalObjectId = JSON.parse(stdout)[0].id
        console.log(`Service principal id: ${servicePrincipalObjectId}`)

        const newAttributes = {
            ...environmentConfig.attributes,
            github_service_principal: servicePrincipalName,
            github_service_principal_id: servicePrincipalObjectId,
        }

        fs.writeFileSync(
            environmentConfig.environmentFile,
            `---
${Object.keys(newAttributes)
    .map((key) => `${key}: ${newAttributes[key]}`)
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

        console.log(`🎉 Success 🎉`)
        console.log(
            `🎉 Ensure you copy the credentials, the secret will not be stored in ${environmentConfig.environmentFile} 🎉`,
        )
    }
}
