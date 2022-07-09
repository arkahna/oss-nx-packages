import { ResourceManagementClient } from '@azure/arm-resources'

export async function ensureResourceGroupExists(
    resourceGroupName: string,
    rm: ResourceManagementClient,
    location: string
) {
    console.log(`Ensuring resource group ${resourceGroupName} exists`)
    await rm.resourceGroups.createOrUpdate(resourceGroupName, {
        location,
    })
}
