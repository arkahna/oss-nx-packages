import execa from 'execa'

export async function getCurrentAzAccount(): Promise<{
    environmentName: string
    homeTenantId: string
    id: string
    isDefault: boolean
    managedByTenants: string[]
    name: string
    state: 'Enabled'
    tenantId: string
    user: {
        name: string
        type: string
    }
}> {
    const { stdout: accountShowStdOut } = await execa(`az`, ['account', 'show'])
    const accountShow = JSON.parse(accountShowStdOut)
    return accountShow
}
