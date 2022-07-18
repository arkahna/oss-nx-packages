import { NxTerraformAddEnvironmentSchema } from './schema'

export function ensureResourceNameDefaults(
    options: NxTerraformAddEnvironmentSchema,
    azureResourcePrefix: string | undefined,
    azureWorkloadCode: string,
) {
    const azureResourcePrefixWithDash = azureResourcePrefix ? `${azureResourcePrefix}-` : ''
    if (!options.resourceGroupName) {
        options.resourceGroupName =
            options.resourceGroupName ||
            `${azureResourcePrefixWithDash}rg-${options.environmentName}-${azureWorkloadCode}`.toLowerCase()
    }
    if (!options.tfStorageAccountName) {
        options.tfStorageAccountName =
            options.tfStorageAccountName?.replace(/-/g, '') ||
            `${azureResourcePrefixWithDash}${options.environmentName}tfstore${azureWorkloadCode}`
                .replace(/-/g, '')
                .toLowerCase()
    }
    if (!options.tfWorkspaceName) {
        options.tfWorkspaceName =
            options.tfWorkspaceName || `${azureWorkloadCode}-${options.environmentName}`
    }
    if (!options.keyVaultName) {
        options.keyVaultName =
            options.keyVaultName ||
            `${azureResourcePrefixWithDash}kv-${options.environmentName}-${azureWorkloadCode}`.toLowerCase()
    }
}
