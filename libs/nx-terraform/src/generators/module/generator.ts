import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    names,
    offsetFromRoot,
    Tree,
} from '@nrwl/devkit'
import * as path from 'path'
import { NxTerraformGeneratorSchema } from './schema'

interface NormalizedSchema extends NxTerraformGeneratorSchema {
    projectName: string
    projectRoot: string
    projectDirectory: string
    parsedTags: string[]
}

function normalizeOptions(options: NxTerraformGeneratorSchema): NormalizedSchema {
    // NX default is to kebab case, we will take the name verbatim in terraform
    // original: projectsnames(options.name).fileName
    const name = options.name
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : name
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
    const projectRoot = `tfmodules/${projectDirectory}`
    const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : []

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        parsedTags,
    }
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        template: '',
    }
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions)
}

export default async function (tree: Tree, options: NxTerraformGeneratorSchema) {
    const normalizedOptions = normalizeOptions(options)
    addProjectConfiguration(tree, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}`,
        targets: {
            lint: {
                executor: '@arkahna/nx-workspace:run-command',
                options: {
                    command: 'terraform fmt -check',
                    cwd: normalizedOptions.projectRoot,
                },
            },
        },
        tags: normalizedOptions.parsedTags,
    })
    addFiles(tree, normalizedOptions)
    await formatFiles(tree)

    return () => {
        console.log('🎉 Success 🎉')
    }
}
