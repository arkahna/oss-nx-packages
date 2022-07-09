import { writeFile, readFile } from 'node:fs/promises'
import {} from 'node:path'
;(async function () {
    await removePublishDir('dist/libs/nx-terraform/package.json')
    await removePublishDir('dist/libs/nx-workspace/package.json')
    await removePublishDir('dist/libs/nx-gh-actions/package.json')
})()

async function removePublishDir(nxTerraformPackageJsonName: string) {
    const packageJson = await readFile(nxTerraformPackageJsonName)
    const packageJsonParsed = JSON.parse(packageJson.toString())
    delete packageJsonParsed.publishConfig.directory
    await writeFile(
        nxTerraformPackageJsonName,
        JSON.stringify(packageJsonParsed, null, 4)
    )
}
