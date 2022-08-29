import fs from 'node:fs'
import path from 'node:path'

export function ensureNoBackendFile(projectRoot: string) {
    if (fs.existsSync(path.join(projectRoot, 'backend.tf'))) {
        throw new Error(
            "backend.tf file exists which causes issues with init using 'local' environment. Remove it before running nx-terraform init or specify an environment.",
        )
    }
}
