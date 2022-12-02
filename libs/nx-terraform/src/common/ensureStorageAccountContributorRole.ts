import { ResourceManagementClient } from '@azure/arm-resources'
import uuid from 'uuid-by-string'

export async function ensureStorageAccountContributorRole(
    containerName: string,
    rm: ResourceManagementClient,
    resourceGroupName: string,
    storageAccountName: string,
    environmentName: string,
    currentPrincipal: string,
    subscriptionId: string,
) {
    console.log(`Ensuring current user has storage contributor role on ${containerName}`)
    const storageContributorRole = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Storage',
        '',
        `storageAccounts/${storageAccountName}/providers/Microsoft.Authorization/roleAssignments`,
        `${uuid(environmentName + storageAccountName + currentPrincipal)}`,
        '2022-01-01-preview',
        {
            properties: {
                // Storage Blob Data Contributor
                roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe`,
                principalId: currentPrincipal,
            },
        },
    )
    await storageContributorRole.pollUntilDone()
}
