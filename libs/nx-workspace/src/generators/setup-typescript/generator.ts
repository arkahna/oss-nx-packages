import {
    addDependenciesToPackageJson,
    formatFiles,
    generateFiles,
    installPackagesTask,
    Tree,
    updateJson,
} from '@nrwl/devkit'
import * as path from 'path'
import { editorConfigDefault } from '../../common/editor-config'
import { SetupTypeScriptSchema } from './schema'

function addFiles(tree: Tree, options: SetupTypeScriptSchema) {
    const templateOptions = {
        ...options,
        template: '',
    }
    generateFiles(tree, path.join(__dirname, 'files'), '.', templateOptions)
}

export default async function (tree: Tree, options: SetupTypeScriptSchema) {
    addFiles(tree, options)

    // Ensure some typescript settings
    updateJson(tree, 'tsconfig.base.json', (value) => {
        value.strict = true
        value.esModuleInterop = true

        return value
    })

    // Configure VSCode settings
    if (!tree.exists('.vscode/settings.json')) {
        tree.write('.vscode/settings.json', JSON.stringify({}, null, 4))
    }

    updateJson(tree, '.vscode/settings.json', (value) => {
        value['editor.codeActionsOnSave'] = {
            'source.organizeImports': true,
        }
        value['editor.formatOnSave'] = true
        value['editor.defaultFormatter'] = 'esbenp.prettier-vscode'
        value['typescript.tsdk'] = 'node_modules\\typescript\\lib'
        value['typescript.preferences.importModuleSpecifier'] =
            'project-relative'

        return value
    })

    // Add tasks
    if (!tree.exists('.vscode/tasks.json')) {
        tree.write(
            '.vscode/tasks.json',
            JSON.stringify(
                {
                    version: '2.0.0',
                    tasks: [],
                },
                null,
                4
            )
        )
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    updateJson(tree, '.vscode/tasks.json', (value) => {
        if (
            !value.tasks.some(
                (task: any) =>
                    task.type === 'typescript' && task.option === 'watch'
            )
        ) {
            value.tasks.push({
                type: 'typescript',
                tsconfig: 'tsconfig.json',
                option: 'watch',
                problemMatcher: ['$tsc-watch'],
                group: {
                    kind: 'build',
                },
                label: 'tsc: watch - tsconfig.json',
                isBackground: true,
            })
        }

        if (
            !value.tasks.some(
                (task: any) => task.label === 'Run vitest test file'
            )
        ) {
            value.tasks.push({
                type: 'process',
                command: 'pnpm',
                args: ['vitest', 'run', '${relativeFile}'],
                group: 'test',
                isTestCommand: true,
                options: {
                    env: {
                        NODE_ENV: 'test',
                    },
                },
                problemMatcher: [],
                label: 'Run vitest test file',
            })
        }

        if (
            !value.tasks.some(
                (task: any) => task.label === 'Watch vitest test file'
            )
        ) {
            value.tasks.push({
                type: 'process',
                command: 'pnpm',
                args: ['vitest', '${relativeFile}'],
                group: 'test',
                isTestCommand: true,
                options: {
                    env: {
                        NODE_ENV: 'test',
                    },
                },
                problemMatcher: [],
                label: 'Watch vitest test file',
            })
        }

        return value
    })

    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (!tree.exists('vitest.config.ts')) {
        tree.write(
            'vitest.config.ts',
            `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ['**/src/**/*.{test,spec}.{ts,mts,cts,tsx}']
    },
})

// To add React support
// * Add \`import react from '@vitejs/plugin-react'\` to imports
// * Add \`, react()\` to the \`plugins\` array
// * Set \`test.environment\` to \`jsdom\`
`
        )
    }

    addTypeScriptEditorConfig(tree, '.')
    addDependenciesToPackageJson(
        tree,
        {},
        {
            vitest: 'latest',
            esbuild: 'latest',
            vite: 'latest',
            'vite-tsconfig-paths': 'latest',
            'esbuild-register': 'latest',
        }
    )
    await formatFiles(tree)

    return () => {
        installPackagesTask(tree)
    }
}

function addTypeScriptEditorConfig(tree: Tree, projectRoot: string) {
    const editorConfig = path.join(projectRoot, '.editorconfig')
    if (!tree.exists(editorConfig)) {
        tree.write(editorConfig, editorConfigDefault)
    }

    // There is no additional config for TypeScript over the default
    const editorConfigContents = tree.read(editorConfig)?.toString()

    tree.write(editorConfig, editorConfigContents || '')
}
