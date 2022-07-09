import { RepoSettings } from './read-repo-settings'
import { EnvConfig } from './readConfigFromEnvFile'

export function getTfEnvVars(
    projectName: string,
    envConfig: EnvConfig,
    repoConfig: RepoSettings
) {
    return [
        `workload_code=${repoConfig.azureWorkloadCode || ''}`,
        `subscription_id=${envConfig.subscriptionId || ''}`,
        `tenant_id=${envConfig.tenantId || ''}`,
        `storage_account_name=${envConfig.terraformStorageAccount || ''}`,
        `storage_container_name=${envConfig.terraformStorageContainer || ''}`,
        `resource_location=${envConfig.resourceLocation || ''}`,
        `resource_location_short=${getShortResourceLocation(
            envConfig.resourceLocation
        )}`,
        `resource_group_name=${envConfig.resourceGroupName || ''}`,
        `keyvault_name=${envConfig.keyVaultName || ''}`,
        `vnet_name=${envConfig.vnetName || ''}`,
        `subnet_name=${envConfig.subnetName || ''}`,
        `environment_tag=${envConfig.environment || ''}`,
        `owner_tag=${repoConfig.owner || ''}`,
        `author_tag=${repoConfig.author || ''}`,
        `workload_tag=${repoConfig.azureWorkloadName || ''}`,
        `project_name_tag=${projectName || ''}`,
        `cost_centre_tag=${repoConfig.azureCostCentre || ''}`,
        `resource_prefix=${repoConfig.azureResourcePrefix || ''}`,
    ]
}
function getShortResourceLocation(resourceLocation: string) {
    // Taken from https://github.com/claranet/terraform-azurerm-regions/blob/master/regions.tf#L71

    const short_names: Record<string, string> = {
        'us-east': 'ue',
        'us-east-2': 'ue2',
        'us-central': 'uc',
        'us-north-central': 'unc',
        'us-south-central': 'usc',
        'us-west-central': 'uwc',
        'us-west': 'uw',
        'us-west-2': 'uw2',
        'can-east': 'cae',
        'can-central': 'cac',
        'bra-south': 'brs',
        'bra-south-east': 'brse', // Brazil Southeast
        'eu-north': 'eun',
        'eu-west': 'euw',
        'fr-central': 'frc',
        'fr-south': 'frs',
        'uk-west': 'ukw',
        'uk-south': 'uks',
        'ger-central': 'gce',
        'ger-north-east': 'gne',
        'ger-north': 'gno',
        'ger-west-central': 'gwc',
        'swz-north': 'swn',
        'swz-west': 'sww',
        'norw-east': 'noe',
        'norw-west': 'now',
        'asia-south-east': 'ase',
        'asia-east': 'ae',
        'aus-east': 'aue',
        'aus-south-east': 'ause',
        'aus-central': 'auc',
        'aus-central-2': 'auc2',
        'cn-east': 'cne',
        'cn-north': 'cnn',
        'cn-east-2': 'cne2',
        'cn-north-2': 'cnn2',
        'cn-east-3': 'cne3',
        'cn-north-3': 'cnn3',
        'ind-central': 'inc',
        'ind-west': 'inw',
        'ind-south': 'ins',
        'jap-east': 'jpe',
        'jap-west': 'jpw',
        'kor-central': 'krc',
        'kor-south': 'krs',
        'saf-west': 'saw',
        'saf-north': 'san',
        'uae-central': 'uaec',
        'uae-north': 'uaen',

        // Global/continental zones
        asia: 'asia', // Asia
        'asia-pa': 'asiapa', // Asia Pacific
        aus: 'aus', // Australia
        bra: 'bra', // Brazil
        can: 'can', // Canada
        eu: 'eu', // Europe
        global: 'glob', // Global
        ind: 'ind', // India
        jap: 'jap', // Japan
        uk: 'uk', // United Kingdom
        us: 'us', // United States
    }

    return short_names[resourceLocation] || resourceLocation
}
