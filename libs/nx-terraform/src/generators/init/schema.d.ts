import { TerraformStateType } from '../../common/tf-state-types'

export interface NxTerraformInitSchema {
    stateType: TerraformStateType
    terraformCloudOrganization?: string
    azureResourcePrefix?: string
    azureWorkloadName?: string
    azureWorkloadCode?: string
    costCentre?: string
    owner?: string
    author?: string
}
