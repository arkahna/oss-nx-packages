import { ResourceManagementClient } from '@azure/arm-resources'
import uuid from 'uuid-by-string'

export async function ensureKeyvaultExists(
    rm: ResourceManagementClient,
    subscriptionId: string,
    resourceGroupName: string,
    keyVaultName: string,
    keyVaultPrivateEndpointName: string,
    vnetName: string,
    subnetName: string,
    tenantId: string,
    location: string,
    currentPrincipal: string,
    environmentName: string,
    tags: {
        [propertyName: string]: string
    }
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
        }
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
        }
    )
    await privateDnsZoneRequest.pollUntilDone()

    console.log(`Ensuring keyvault dns zone virtual link`)
    const privateDnsZoneVirtualNetworkLinksRequest =
        await rm.resources.beginCreateOrUpdate(
            resourceGroupName,
            'Microsoft.Network',
            'privateDnsZones',
            `${privateDnsZoneName}/virtualNetworkLinks`,
            `link_to_${vnetName}`,
            '2020-01-01',
            {
                properties: {
                    registrationEnabled: false,
                    virtualNetwork: {
                        id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/${vnetName}`,
                    },
                    dependencies: [privateDnsZoneName],
                },
                tags,
                location: 'global',
            }
        )
    await privateDnsZoneVirtualNetworkLinksRequest.pollUntilDone()

    console.log(`Ensuring keyvault private endpoint for ${keyVaultName} exists`)
    const privateEndpointRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Network',
        '',
        'privateEndpoints',
        keyVaultPrivateEndpointName,
        '2021-03-01',
        {
            properties: {
                privateLinkServiceConnections: [
                    {
                        name: keyVaultPrivateEndpointName,
                        properties: {
                            privateLinkServiceId: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.KeyVault/vaults/${keyVaultName}`,
                            groupIds: ['vault'],
                        },
                    },
                ],
                subnet: {
                    id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/${vnetName}/subnets/${subnetName}`,
                },
                customDnsConfigs: [
                    {
                        fqdn: `${keyVaultName}.vaultcore.azure.net`,
                    },
                ],
            },
            tags,
            location,
        }
    )
    await privateEndpointRequest.pollUntilDone()

    console.log(
        `Ensuring keyvault private endpoint dns for ${keyVaultName} exists`
    )
    const zoneGroupRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Network',
        'privateEndpoints',
        `${keyVaultPrivateEndpointName}/privateDnsZoneGroups`,
        `vaultPrivateDnsZoneGroup`,
        '2020-06-01',
        {
            properties: {
                privateDnsZoneConfigs: [
                    {
                        name: 'dnsConfig',
                        properties: {
                            privateDnsZoneId: `subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/privateDnsZones/${privateDnsZoneName}`,
                        },
                    },
                ],
            },
            location,
        }
    )
    await zoneGroupRequest.pollUntilDone()

    console.log(
        `Ensuring current user has secrets officier role on ${keyVaultName}`
    )
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
        }
    )
    await storageContributorRole.pollUntilDone()
}
