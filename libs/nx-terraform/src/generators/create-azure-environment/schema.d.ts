import { AzureLogLevel } from '@azure/logger'
export interface NxTerraformAddEnvironmentSchema {
    environmentName: string
    subscriptionId: string
    tenantId: string
    location: string

    tfStorageAccountName?: string
    containerName: string
    tfWorkspaceName?: string

    skipEnvironmentCreation: boolean

    resourceGroupName?: string
    keyVaultName?: string

    azureLogLevel?: AzureLogLevel
}
