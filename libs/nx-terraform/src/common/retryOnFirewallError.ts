export async function retryOnFirewallError<T>(
    command: () => Promise<T>,
    {
        retryAttempts,
        retryDelay,
        quiet,
    }: {
        retryAttempts: number
        /** Retry delay in seconds */
        retryDelay: number
        quiet?: boolean
    },
): Promise<T> {
    let attempts = 0
    do {
        // Wait 5 seconds for firewall rules to propagate
        await new Promise((resolve) => setTimeout(resolve, retryDelay * 1000))
        attempts++

        try {
            return await command()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err?.message?.includes('AuthorizationFailure')) {
                if (!quiet) {
                    console.log('Failed to init due to firewall rule not applied yet, retrying...')
                }
                // Firewall issue
                continue
            }
            throw err
        }
    } while (attempts < retryAttempts)

    throw new Error('Firewall issue, retry attempts exhausted. Try increasing attempts or timeout')
}
