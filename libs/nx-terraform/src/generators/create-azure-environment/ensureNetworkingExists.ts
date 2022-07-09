import { ResourceManagementClient } from '@azure/arm-resources'

export async function ensureNetworkingExists(
    subscriptionId: string,
    vnetName: string,
    subnetName: string,
    rm: ResourceManagementClient,
    resourceGroupName: string,
    virtualNetworkAddressPrefix: string,
    subnetAddressPrefix: string,
    location: string,
    tags: {
        [propertyName: string]: string
    }
) {
    const nsgName = `${subnetName}nsg`
    console.log(`Ensuring nsg ${nsgName} exists`)
    const nsgRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Network',
        '',
        'networkSecurityGroups',
        nsgName,
        '2019-08-01',
        {
            tags,
            location,
            properties: {
                securityRules: [],
            },
        }
    )
    await nsgRequest.pollUntilDone()

    console.log(`Ensuring vnet ${vnetName} exists`)
    const vnetRequest = await rm.resources.beginCreateOrUpdate(
        resourceGroupName,
        'Microsoft.Network',
        '',
        'virtualNetworks',
        vnetName,
        '2019-11-01',
        {
            tags,
            location,
            properties: {
                addressSpace: {
                    addressPrefixes: [virtualNetworkAddressPrefix],
                },
                subnets: [
                    {
                        name: subnetName,
                        properties: {
                            addressPrefix: subnetAddressPrefix,
                            networkSecurityGroup: {
                                id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/${nsgName}`,
                            },
                            privateEndpointNetworkPolicies: 'Disabled',
                            privateLinkServiceNetworkPolicies: 'Enabled',
                        },
                    },
                ],
            },
        }
    )
    await vnetRequest.pollUntilDone()
}
