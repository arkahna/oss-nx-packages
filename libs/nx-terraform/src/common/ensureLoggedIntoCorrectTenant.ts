import { getCurrentAzAccount } from './getCurrentAzAccount'

export async function ensureLoggedIntoCorrectTenant(tenantId: string) {
    console.log('Ensuring logged in to correct tenant')
    const accountShow = await getCurrentAzAccount()
    if (accountShow.tenantId !== tenantId) {
        console.log(
            'Current subscription belongs to wrong Tenant, select the correct subscription using:',
        )
        console.log(`> az login --tenant ${tenantId}`)

        throw new Error('Tenant id does not match')
    }
}
