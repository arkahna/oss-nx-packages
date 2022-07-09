import { ResourceManagementClient } from '@azure/arm-resources'
import uuid from 'uuid-by-string'

export async function ensureTfStorageAccountExists(
    subscriptionId: string,
    environmentName: string,
    storageAccountName: string,
    containerName: string,
    rm: ResourceManagementClient,
    resourceGroupName: string,
    location: string,
    currentPrincipal: string,
    tags: {
        [propertyName: string]: string
    }
) {
    console.log(`Ensuring storage account ${storageAccountName} exists`)
    const storageAccountRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Storage',
        '',
        'storageAccounts',
        storageAccountName,
        '2021-08-01',
        {
            sku: {
                name: 'Standard_LRS',
            },
            kind: 'StorageV2',
            tags,
            location,
            properties: {
                allowBlobPublicAccess: false,
                allowSharedKeyAccess: false,
                isHnsEnabled: true,
                minimumTlsVersion: 'TLS1_2',
                supportsHttpsTrafficOnly: true,
                networkAcls: {
                    bypass: 'AzureServices',
                    defaultAction: 'Deny',
                    ipRules: [],
                    virtualNetworkRules: [],
                },
            },
        }
    )
    await storageAccountRequest.pollUntilDone()

    console.log(
        `Ensuring current user has storage contributor role on ${containerName}`
    )
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
        }
    )
    await storageContributorRole.pollUntilDone()

    console.log(`Ensuring storage container ${containerName} exists`)
    const storageAccountContainerRequest =
        await rm.resources.beginCreateOrUpdate(
            resourceGroupName,
            'Microsoft.Storage',
            '',
            `storageAccounts/${storageAccountName}/blobServices`,
            `default/containers/${containerName}`,
            '2021-08-01',
            {}
        )
    await storageAccountContainerRequest.pollUntilDone()
}
