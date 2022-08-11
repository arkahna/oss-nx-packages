import { Tree } from '@nrwl/devkit'
import execa from 'execa'
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

    const servicePrincipalName = `gh-actions-${repoSettings.azureResourcePrefix}-${options.environmentName}-sp`
    const scopes = `/subscriptions/${environmentConfig.subscriptionId}/resourcegroups/${environmentConfig.resourceGroupName}`
    const containerScope = `/subscriptions/${environmentConfig.subscriptionId}/resourceGroups/${environmentConfig.resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${environmentConfig.terraformStorageAccount}/blobServices/default/containers/${environmentConfig.terraformStorageContainer}`

    if (isDryRun()) {
        console.log('Will run:')

        console.log(`> az ad sp create-for-rbac --role ${options.role} \
    --scopes ${scopes} \
    --name ${servicePrincipalName} \
    --sdk-auth`)

        console.log(`> az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee ${servicePrincipalName} \
    --scope "${containerScope}"
    `)
    }

    const newAttributes = {
        ...environmentConfig.attributes,
        github_service_principal: servicePrincipalName,
    }

    tree.write(
        environmentConfig.environmentFile,
        `---
${Object.keys(newAttributes)
    .map((key) => `${key}: ${newAttributes[key]}`)
    .join('\n')}
---

${environmentConfig.environmentFileBody}
`,
    )

    return async () => {
        await execa(
            `az`,
            [
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
            ],
            {
                stdio: 'inherit',
            },
        )

        await execa(
            'az',
            [
                'role',
                'assignment',
                'create',
                '--role',
                'Storage Blob Data Contributor',
                '--assignee',
                servicePrincipalName,
                '--scope',
                containerScope,
            ],
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
