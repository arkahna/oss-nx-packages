import { generateFiles, Tree, updateJson } from '@nrwl/devkit'
import * as path from 'path'
import { NxTerraformInitSchema } from './schema'

export default async function (tree: Tree, options: NxTerraformInitSchema) {
    generateFiles(tree, path.join(__dirname, 'files'), './.vscode', {})

    updateJson(tree, '.vscode/settings.json', (value) => {
        value['[terraform]'] = {
            'editor.defaultFormatter': 'hashicorp.terraform',
        }
        value['[terraform-vars]'] = {
            'editor.defaultFormatter': 'hashicorp.terraform',
        }
        value['terraform.experimentalFeatures.validateOnSave'] = true

        return value
    })

    updateJson(
        tree,
        'package.json',
        ({
            name,
            version,
            author,
            owner,
            licence,
            private: p,
            terraformStateType,
            terraformCloudOrganization,
            azureResourcePrefix,
            azureWorkloadName,
            azureWorkloadCode,
            azureCostCentre,
            ...rest
        }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newPackageJson: any = {
                name,
                version,
                author: options.author || author,
                owner: options.owner || owner,
                licence,
                private: p,

                terraformStateType: options.stateType || terraformStateType,
                terraformCloudOrganization:
                    options.terraformCloudOrganization || terraformCloudOrganization,
                azureResourcePrefix: options.azureResourcePrefix || azureResourcePrefix,
                azureWorkloadName: options.azureWorkloadName || azureWorkloadName,
                azureWorkloadCode: options.azureWorkloadCode || azureWorkloadCode,
                azureCostCentre: options.costCentre || azureCostCentre,

                ...rest,
            }
            return newPackageJson
        },
    )

    return () => {
        console.log('🎉 Success 🎉')
    }
}
