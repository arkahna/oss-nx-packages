import { DefaultAzureCredential } from '@azure/identity'
import fetch from 'node-fetch'

export async function getCurrentPrincipal(
    credentials = new DefaultAzureCredential()
): Promise<string> {
    const tokenResponse = await credentials.getToken(
        'https://graph.microsoft.com/.default'
    )
    const meResponse = await fetch('https://graph.microsoft.com/v1.0/me/', {
        headers: {
            Authorization: `Bearer ${tokenResponse.token}`,
        },
    })

    const result = await meResponse.json()

    return result.id
}
