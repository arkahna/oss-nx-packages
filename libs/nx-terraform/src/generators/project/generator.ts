import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    names,
    offsetFromRoot,
    Tree,
} from '@nrwl/devkit'
import * as path from 'path'
import { readRepoSettings } from '../../common/read-repo-settings'
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
    const projectRoot = `tfprojects/${projectDirectory}`
    const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : []

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        parsedTags,
    }
}

function addFiles(
    tree: Tree,
    terraformCloudOrganization: string,
    azureResourcePrefix: string,
    options: NormalizedSchema,
) {
    const templateOptions = {
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        template: '',
        clientName: terraformCloudOrganization,
        resourcePrefix: azureResourcePrefix,
    }

    generateFiles(
        tree,
        // TODO can have different presets for differnt types of terraform projects
        path.join(__dirname, 'files/azure'),
        options.projectRoot,
        templateOptions,
    )
}

export default async function (tree: Tree, options: NxTerraformGeneratorSchema) {
    const { azureResourcePrefix, terraformCloudOrganization } = readRepoSettings()

    const normalizedOptions = normalizeOptions(options)
    addProjectConfiguration(tree, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'application',
        sourceRoot: `${normalizedOptions.projectRoot}`,
        targets: {
            plan: {
                executor: '@arkahna/nx-terraform:plan',
                options: {},
            },
            apply: {
                executor: '@arkahna/nx-terraform:apply',
                options: {},
            },
            destroy: {
                executor: '@arkahna/nx-terraform:destroy',
                options: {},
            },
            state: {
                executor: '@arkahna/nx-terraform:state',
                options: {},
            },
            output: {
                executor: '@arkahna/nx-terraform:output',
                options: {},
            },
            tfinit: {
                executor: '@arkahna/nx-terraform:tf-init',
                options: {},
            },
            lint: {
                executor: '@arkahna/nx-terraform:lint',
                options: {},
            },
        },
        tags: normalizedOptions.parsedTags,
        implicitDependencies: [],
        ...{ azureWorkloadOverride: normalizedOptions.azureWorkloadOverride },
    })
    addFiles(tree, terraformCloudOrganization, azureResourcePrefix, normalizedOptions)

    const existingTfProjectsReadme =
        tree.read('tfprojects/README.md')?.toString() ||
        `# Terraform Projects

The projects should be run in the following order:

`
    tree.write(
        'tfprojects/README.md',
        existingTfProjectsReadme +
            `\n* [${normalizedOptions.projectName}](${normalizedOptions.projectRoot})`,
    )

    tree.write(`${normalizedOptions.projectRoot}/.gitignore`, terraformProjectGitIgnore)
    await formatFiles(tree)

    return () => {
        console.log()
        console.log()

        console.log('🎉 Success 🎉')
        console.log(
            '\x1b[33m%s\x1b[0m',
            'Remember to update the implicitDependencies for this terraform project',
        )
    }
}

const terraformProjectGitIgnore = `# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# Crash log files
crash.log

# Exclude all .tfvars files, which are likely to contain sentitive data, such as
# password, private keys, and other secrets. These should not be part of version
# control as they are data points which are potentially sensitive and subject
# to change depending on the environment.
#
*.tfvars

# Ignore override files as they are usually used to override resources locally and so
# are not checked in
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Include override files you do wish to add to version control using negated pattern
#
# !example_override.tf

# Include tfplan files to ignore the plan output of command: terraform plan -out=tfplan
# example: *tfplan*

# Ignore CLI configuration files
.terraformrc
terraform.rc


backend.tf
`
