// cred-def-registration.ts
import { getAgent } from "./agent.js"

export async function registerCredentialDefinition(schemaId:string) {
  try {
    console.log('📋 Registering credential definition...')
    const agent = getAgent()
    
    const credentialDefinitionResult = await agent.modules.anoncreds.registerCredentialDefinition({
      credentialDefinition: {
        issuerId: "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ",
        schemaId: schemaId,
        tag: 'default',
        signatureType: 'CL',
      },
      options: {
        supportRevocation: false,
      },
    })
    
    console.log('📊 Credential Definition State:', credentialDefinitionResult.credentialDefinitionState.state)
    
    if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
      throw new Error(`Credential definition registration failed: ${credentialDefinitionResult.credentialDefinitionState.reason}`)
    }
    
    if (!credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId) {
      throw new Error('Credential definition ID not returned')
    }
    
    console.log(`✅ Credential definition registered: ${credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId}`)
    return credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId
    
  } catch (error) {
    console.error('❌ Failed to register credential definition:', error)
    throw error
  }
}