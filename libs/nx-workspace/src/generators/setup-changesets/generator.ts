import { addDependenciesToPackageJson, installPackagesTask, Tree, updateJson } from '@nrwl/devkit'
import execa from 'execa'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { SetupPNPMGeneratorSchema } from './schema'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function (tree: Tree, options: SetupPNPMGeneratorSchema) {
    if (options.setupReleaseAction) {
        createReleaseActionWorkflow(tree)
        updateJson(tree, 'package.json', (value) => {
            if (!value.scripts['build']) {
                value.scripts['build'] = 'pnpm nx run-many --target build --all'
            }

            value.scripts['release'] = 'pnpm run build && pnpm publish -r'
            return value
        })
    }

    addDependenciesToPackageJson(
        tree,
        {},
        {
            // See https://github.com/changesets/changesets/pull/662
            '@changesets/cli':
                'https://pkg.csb.dev/changesets/changesets/commit/0a652ea1/@changesets/cli',
            '@changesets/git':
                'https://pkg.csb.dev/changesets/changesets/commit/0a652ea1/@changesets/git',
            '@changesets/changelog-github': 'latest',
        },
    )

    return async () => {
        installPackagesTask(tree)

        await execa('pnpm', ['changeset', 'init'], { stdio: 'inherit' })
        const { stdout: originUrl } = await execa('git', ['remote', 'get-url', 'origin'], {
            stdio: 'inherit',
        })
        const repo = originUrl.match(/([^:/]*\/[^:/]*)\.git/)?.[1]
        if (!repo) {
            throw new Error('Cannot figure out repo name from origin url ' + originUrl)
        }

        const changesetsConfig = path.resolve(tree.root, '.changeset/config.json')
        const changesetsConfigContents = await readFile(changesetsConfig)
        const changesetsConfigJson = JSON.parse(changesetsConfigContents.toString())
        changesetsConfigJson.baseBranch = 'main'
        changesetsConfigJson.changelog = [
            '@changesets/changelog-github',
            {
                repo: repo,
            },
        ]
        await writeFile(changesetsConfig, JSON.stringify(changesetsConfigJson, null, 4))
    }
}
function createReleaseActionWorkflow(tree: Tree) {
    tree.write(
        '.github/workflows/release.yml',
        `name: Release

on:
    push:
        branches:
            - main

jobs:
    release:
        name: Release
        runs-on: ubuntu-latest
        permissions:
            contents: write
            packages: write
            pull-requests: write
            issues: read

        steps:
            - name: Checkout Repo
              uses: actions/checkout@v2
              with:
                  # This makes Actions fetch all Git history so that Changesets can generate changelogs with the correct commits
                  fetch-depth: 0

            - name: Setup Node.js 16.x
              uses: actions/setup-node@v2
              with:
                  node-version: 16.x
                  registry-url: 'https://npm.pkg.github.com'
                  # Defaults to the user or organization that owns the workflow file
                  scope: '@arkahna'

            - name: Cache pnpm modules
              uses: actions/cache@v2
              with:
                  path: ~/.pnpm-store
                  key: \${{ runner.os }}-\${{ hashFiles('**/pnpm-lock.yaml') }}
                  restore-keys: |
                      \${{ runner.os }}-

            - uses: pnpm/action-setup@v2.1.0
              with:
                  version: latest
                  run_install: |
                      - recursive: true

            - name: Create Release Pull Request or Publish to npm
              id: changesets
              uses: changesets/action@v1
              with:
                  publish: pnpm run release
                  version: pnpm version
              env:
                  GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
                  NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
    )
}
