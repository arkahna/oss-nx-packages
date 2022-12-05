import { RepoSettings } from './read-repo-settings'
import { EnvConfig } from './readConfigFromEnvFile'

export function getTfEnvVars(projectName: string, envConfig: EnvConfig, repoConfig: RepoSettings) {
    return [
        `workload_code=${repoConfig.azureWorkloadCode || ''}`,
        `subscription_id=${envConfig.subscriptionId || ''}`,
        `tenant_id=${envConfig.tenantId || ''}`,
        `storage_account_name=${envConfig.terraformStorageAccount || ''}`,
        `storage_container_name=${envConfig.terraformStorageContainer || ''}`,
        `resource_location=${envConfig.resourceLocation || ''}`,
        `resource_location_short=${getShortResourceLocation(envConfig.resourceLocation)}`,
        `resource_group_name=${envConfig.resourceGroupName || ''}`,
        `keyvault_name=${envConfig.keyVaultName || ''}`,
        `environment_tag=${envConfig.environment || ''}`,
        `owner_tag=${repoConfig.owner || ''}`,
        `author_tag=${repoConfig.author || ''}`,
        `workload_tag=${repoConfig.azureWorkloadName || ''}`,
        `project_name_tag=${projectName || ''}`,
        `cost_centre_tag=${repoConfig.azureCostCentre || ''}`,
        `resource_prefix=${repoConfig.azureResourcePrefix || ''}`,
        `github_service_principal_id=${envConfig.github_service_principal_id || ''}`,
    ]
}
function getShortResourceLocation(resourceLocation: string) {
    // Taken from https://github.com/claranet/terraform-azurerm-regions/blob/master/regions.tf#L71

    const cliNames = {
        'us-east': 'eastus', // East US
        'us-east-2': 'eastus2', // East US 2
        'us-south-central': 'southcentralus', // South Central US
        'us-west-2': 'westus2', // West US 2
        'asia-south-east': 'southeastasia', // Southeast Asia
        'eu-north': 'northeurope', // North Europe
        'uk-south': 'uksouth', // UK South
        'eu-west': 'westeurope', // West Europe
        'us-central': 'centralus', // Central US
        'us-north-central': 'northcentralus', // North Central US
        'us-west': 'westus', // West US
        'saf-north': 'southafricanorth', // South Africa North
        'ind-central': 'centralindia', // Central India
        'asia-east': 'eastasia', // East Asia
        'jap-east': 'japaneast', // Japan East
        'kor-central': 'koreacentral', // Korea Central
        'can-central': 'canadacentral', // Canada Central
        'fr-central': 'francecentral', // France Central
        'ger-west-central': 'germanywestcentral', // Germany West Central
        'norw-east': 'norwayeast', // Norway East
        'swz-north': 'switzerlandnorth', // Switzerland North
        'uae-north': 'uaenorth', // UAE North
        'bra-south': 'brazilsouth', // Brazil South
        asia: 'asia', // Asia
        'asia-pa': 'asiapacific', // Asia Pacific
        aus: 'australia', // Australia
        bra: 'brazil', // Brazil
        can: 'canada', // Canada
        eu: 'europe', // Europe
        global: 'global', // Global
        ind: 'india', // India
        jap: 'japan', // Japan
        uk: 'uk', // United Kingdom
        us: 'unitedstates', // United States
        'us-west-central': 'westcentralus', // West Central US
        'saf-west': 'southafricawest', // South Africa West
        'aus-central': 'australiacentral', // Australia Central
        'aus-central-2': 'australiacentral2', // Australia Central 2
        'aus-east': 'australiaeast', // Australia East
        'aus-south-east': 'australiasoutheast', // Australia Southeast
        'jap-west': 'japanwest', // Japan West
        'kor-south': 'koreasouth', // Korea South
        'ind-south': 'southindia', // South India
        'ind-west': 'westindia', // West India
        'can-east': 'canadaeast', // Canada East
        'fr-south': 'francesouth', // France South
        'ger-north': 'germanynorth', // Germany North
        'norw-west': 'norwaywest', // Norway West
        'swz-west': 'switzerlandwest', // Switzerland West
        'uk-west': 'ukwest', // UK West
        'uae-central': 'uaecentral', // UAE Central
        'bra-south-east': 'brazilsoutheast', // Brazil Southeast
        'ger-north-east': 'germanynortheast', // "Germany Northeast"
        'ger-central': 'germanycentral', // "Germany Central"

        'cn-north': 'chinanorth', // "China North"
        'cn-east': 'chinaeast', // "China East"
        'cn-east-2': 'chinaeast2', // "China East 2"
        'cn-north-2': 'chinanorth2', // "China North 2"
        'cn-east-3': 'chinaeast3', // "China East 3"
        'cn-north-3': 'chinanorth3', // "China North 3"
    }
    // Reverse cliNames key and values
    const cliNameLookup = Object.entries(cliNames)
        .map(([key, value]) => [value, key])
        .reduce<Record<string, string | undefined>>(
            (acc, [key, value]) => ({ ...acc, [key]: value }),
            {},
        )

    const short_names: Record<string, string | undefined> = {
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

    const cliNameResourceLocation = cliNameLookup[resourceLocation]
    return (cliNameResourceLocation && short_names[cliNameResourceLocation]) || resourceLocation
}
