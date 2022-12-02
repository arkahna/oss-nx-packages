import { ResourceManagementClient } from '@azure/arm-resources'
import { ensureStorageAccountContributorRole } from '../../common/ensureStorageAccountContributorRole'

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
    },
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
        },
    )
    await storageAccountRequest.pollUntilDone()

    await ensureStorageAccountContributorRole(
        containerName,
        rm,
        resourceGroupName,
        storageAccountName,
        environmentName,
        currentPrincipal,
        subscriptionId,
    )

    console.log(`Ensuring storage container ${containerName} exists`)
    const storageAccountContainerRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Storage',
        '',
        `storageAccounts/${storageAccountName}/blobServices`,
        `default/containers/${containerName}`,
        '2021-08-01',
        {},
    )
    await storageAccountContainerRequest.pollUntilDone()
}
