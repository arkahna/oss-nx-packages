import { workspaceRoot } from '@nrwl/devkit'
import fm from 'front-matter'
import * as fs from 'fs'
import { readFile } from 'fs/promises'
import * as path from 'path'

export async function readEnvironmentFile(environment: string) {
    const environmentFile = path.join(workspaceRoot, `docs/environments/${environment}.md`)

    if (!fs.existsSync(environmentFile)) {
        throw new Error(`Missing environment documentation markdown file at ${environmentFile}`)
    }
    const environmentMarkdown = await readFile(environmentFile)
    const frontMatter = fm(environmentMarkdown.toString())

    if (!frontMatter.attributes || typeof frontMatter.attributes !== 'object') {
        throw new Error(
            `Missing front matter in environment documentation markdown file at ${environmentFile}`,
        )
    }
    const attributes = frontMatter.attributes as Record<string, string | undefined>
    return { attributes, environmentFile, body: frontMatter.body }
}
