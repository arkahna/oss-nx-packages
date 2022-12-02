import { ResourceManagementClient } from '@azure/arm-resources'
import { ensureSecretsOfficerRole } from '../../common/ensureSecretsOfficerRole'

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

    await ensureSecretsOfficerRole(
        keyVaultName,
        rm,
        resourceGroupName,
        environmentName,
        currentPrincipal,
        subscriptionId,
    )
}
