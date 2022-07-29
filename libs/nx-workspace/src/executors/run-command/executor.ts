import execa from 'execa'

export default async function buildExecutor(options: { command: string; cwd?: string }) {
    console.info(`Executing workspace:run-command...`)

    await execa.command(options.command, {
        cwd: options.cwd,
        stdio: [process.stdin, 'pipe', 'pipe'],
    })

    return { success: true }
}
