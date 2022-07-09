export function createTerragruntCliArgs(vars: string[]) {
    return vars.flatMap((variable) => [`-var`, `${variable}`])
}
