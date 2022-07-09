import { formatFiles, generateFiles, Tree, updateJson } from '@nrwl/devkit'
import * as path from 'path'
import { SetupPNPMGeneratorSchema } from './schema'

function addFiles(tree: Tree, options: SetupPNPMGeneratorSchema) {
    const templateOptions = {
        ...options,
        template: '',
    }
    generateFiles(tree, path.join(__dirname, 'files'), '.', templateOptions)
}

export default async function (tree: Tree, options: SetupPNPMGeneratorSchema) {
    addFiles(tree, options)
    updateJson(tree, 'package.json', (value) => {
        if (!value.scripts.preinstall) {
            value.scripts.preinstall = 'npx only-allow pnpm'
        } else {
            console.warn(
                'package.json already has a preinstall script, add `"preinstall": "npx only-allow pnpm"` manually'
            )
        }

        return value
    })
    await formatFiles(tree)
}
