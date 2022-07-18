import { ResourceManagementClient } from '@azure/arm-resources'
import uuid from 'uuid-by-string'

export async function ensureKeyvaultExists(
    rm: ResourceManagementClient,
    subscriptionId: string,
    resourceGroupName: string,
    keyVaultName: string,
    tenantId: string,
    location: string,
    currentPrincipal: string,
    environmentName: string,
    tags: {
        [propertyName: string]: string
    },
) {
    console.log(`Ensuring keyvault ${keyVaultName} exists`)
    const keyvaultRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.KeyVault',
        '',
        'vaults',
        keyVaultName,
        '2021-11-01-preview',
        {
            properties: {
                enableRbacAuthorization: true,
                tenantId: tenantId,
                sku: {
                    family: 'A',
                    name: 'standard',
                },
                networkAcls: {
                    bypass: 'AzureServices',
                    defaultAction: 'Deny',
                    ipRules: [],
                    virtualNetworkRules: [],
                },
            },
            tags,
            location,
        },
    )
    await keyvaultRequest.pollUntilDone()

    const privateDnsZoneName = `privatelink.vaultcore.azure.net`
    console.log(`Ensuring keyvault dns zone for ${keyVaultName} exists`)
    const privateDnsZoneRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Network',
        '',
        'privateDnsZones',
        privateDnsZoneName,
        '2018-09-01',
        {
            properties: {
                maxNumberOfRecordSets: 25000,
                maxNumberOfVirtualNetworkLinks: 1000,
                maxNumberOfVirtualNetworkLinksWithRegistration: 100,
            },
            tags,
            location: 'global',
        },
    )
    await privateDnsZoneRequest.pollUntilDone()

    console.log(`Ensuring current user has secrets officier role on ${keyVaultName}`)
    const storageContributorRole = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.KeyVault',
        '',
        `vaults/${keyVaultName}/providers/Microsoft.Authorization/roleAssignments`,
        `${uuid(environmentName + keyVaultName + currentPrincipal)}`,
        '2022-01-01-preview',
        {
            properties: {
                // Key Vault Secrets Officer
                roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b86a8fe4-44ce-4948-aee5-eccb2c155cd7`,
                principalId: currentPrincipal,
            },
        },
    )
    await storageContributorRole.pollUntilDone()
}
