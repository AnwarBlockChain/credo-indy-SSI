import { CredentialEventTypes, CredentialState, CredentialStateChangedEvent } from "@credo-ts/core"
import { getAgent } from "./agent.ts"

export async function registerCredentialEventHandlers() {
  const agent = getAgent()

  agent.events.on(
    CredentialEventTypes.CredentialStateChanged,
    async (event: CredentialStateChangedEvent) => {
      const { credentialRecord } = event.payload

      console.log('========================================')
      console.log(`🎫 Credential Event Details:`)
      console.log(`   ID: ${credentialRecord.id}`)
      console.log(`   State: ${credentialRecord.state}`)
      console.log(`   Connection ID: ${credentialRecord.connectionId}`)
      console.log(`   Protocol Version: ${credentialRecord.protocolVersion}`)
      console.log(`   Thread ID: ${credentialRecord.threadId}`)
      console.log('========================================')

      try {
        switch (credentialRecord.state) {
          case CredentialState.OfferSent:
            console.log('✅ Offer sent, waiting for holder to accept...')
            break

          case CredentialState.RequestReceived:
            console.log('➡️ REQUEST RECEIVED from wallet! Issuing credential...')
            await agent.credentials.acceptRequest({
              credentialRecordId: credentialRecord.id,
            })
            console.log('✅ Credential issued successfully')
            break

          case CredentialState.Done:
            console.log('✅ Credential exchange completed')
            break

          default:
            console.log(`ℹ️ Credential state: ${credentialRecord.state}`)
        }
      } catch (error) {
        console.error('❌ Credential flow error:', error)
      }
    }
  )

  console.log('✅ Credential event handlers registered')
}