export async function retryOnFirewallError<T>(
    command: () => Promise<T>,
    {
        retryAttempts,
        retryDelay,
    }: {
        retryAttempts: number
        /** Retry delay in seconds */
        retryDelay: number
    }
) {
    let attempts = 0
    let success = false
    do {
        // Wait 5 seconds for firewall rules to propagate
        await new Promise((resolve) => setTimeout(resolve, retryDelay * 1000))
        attempts++

        try {
            return await command()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err?.message?.includes('AuthorizationFailure')) {
                console.log(
                    'Failed to init due to firewall rule not applied yet, retrying...'
                )
                // Firewall issue
                continue
            }
            throw err
        }
        success = true
    } while (attempts < retryAttempts)

    if (!success) {
        throw new Error(
            'Firewall issue, retry attempts exhausted. Try increasing attempts or timeout'
        )
    }
}
