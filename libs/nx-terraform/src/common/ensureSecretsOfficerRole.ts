import { ResourceManagementClient } from '@azure/arm-resources'
import uuid from 'uuid-by-string'

export async function ensureSecretsOfficerRole(
    keyVaultName: string,
    rm: ResourceManagementClient,
    resourceGroupName: string,
    environmentName: string,
    currentPrincipal: string,
    subscriptionId: string,
) {
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
