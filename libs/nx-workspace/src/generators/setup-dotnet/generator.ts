import {
    addDependenciesToPackageJson,
    formatFiles,
    installPackagesTask,
    Tree,
    updateJson,
} from '@nrwl/devkit'
import execa from 'execa'
import * as path from 'path'
import { editorConfigDefault } from '../../common/editor-config'
import { csSettings } from './cseditor-config'
import { SetupDotnetGeneratorSchema } from './schema'

export default async function (
    tree: Tree,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: SetupDotnetGeneratorSchema
) {
    addCsEditorConfig(tree)

    // Configure VSCode settings
    if (!tree.exists('.vscode/settings.json')) {
        tree.write('.vscode/settings.json', JSON.stringify({}, null, 4))
    }

    updateJson(tree, '.vscode/settings.json', (value) => {
        value['omnisharp.useModernNet'] = true
        value['omnisharp.useGlobalMono'] = 'never'

        value['[csharp]'] = {
            'editor.defaultFormatter': 'ms-dotnettools.csharp',
        }

        return value
    })

    // Configure VSCode Recommended Extensions
    if (!tree.exists('.vscode/extensions.json')) {
        tree.write('.vscode/extensions.json', JSON.stringify({}, null, 4))
    }

    updateJson(tree, '.vscode/extensions.json', (value) => {
        value.recommendations.push(
            'ms-dotnettools.csharp',
            'fernandoescolar.vscode-solution-explorer'
        )
        return value
    })

    updateJson(tree, 'nx.json', (value) => {
        value.generators = value.generators || {}
        value.generators['@nx-dotnet/core'] = { solutionFile: true }

        return value
    })

    addDependenciesToPackageJson(
        tree,
        {},
        {
            '@nx-dotnet/core': 'latest',
            '@nx-dotnet/dotnet': 'latest',
            '@nx-dotnet/utils': 'latest',
        }
    )
    await formatFiles(tree)

    return async () => {
        installPackagesTask(tree)

        // Create SLN file
        await execa('dotnet', ['new', 'sln'])
    }
}

function addCsEditorConfig(tree: Tree) {
    const editorConfig = path.join('.', '.editorconfig')
    if (!tree.exists(editorConfig)) {
        tree.write(editorConfig, editorConfigDefault)
    }

    const editorConfigContents =
        tree.read(editorConfig)?.toString() +
        `

    ${csSettings}`

    tree.write(editorConfig, editorConfigContents)
}
