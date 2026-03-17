// simple-attribute-proof.ts
import { getAgent } from "./agent"

export async function requestSimpleAttributeProof(
  connectionId : string,
    fieldName: string = "gender"

  
    
) {
  const agent = getAgent()
  const credentialDefinitionId = "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ/anoncreds/v0/CLAIM_DEF/3052411/default"
  
  console.log(`🎯 Requesting ${fieldName} attribute proof...`)
  
  // Verify connection first
  const connection = await agent.connections.getById(connectionId)
  if (connection.state !== 'completed') {
    throw new Error(`Connection is not active. State: ${connection.state}`)
  }
  
  console.log(`✅ Connected to: ${connection.theirLabel}`)
  
  // SIMPLER PROOF REQUEST - Just ask for the attribute, no predicate
  const proofRequest = {
    protocolVersion: 'v2' as const,
    connectionId,
    proofFormats: {
      anoncreds: {
        name: `Share your ${fieldName}`,
        version: '1.0',
        requested_attributes: {
          [fieldName]: {
            name: fieldName,
            restrictions: [
              {
                cred_def_id: credentialDefinitionId
              }
            ]
          }
        },
        requested_predicates: {} // Empty - no predicate checks
      }
    },
    comment: `Please share your ${fieldName}`,
    autoAcceptProof: 'always' as const // ✅ Fixed: lowercase 'p'
  }
  
  console.log('📝 Sending simplified proof request...')
  console.log('Request structure:', JSON.stringify(proofRequest, null, 2))
  //@ts-ignore
  const proofRecord = await agent.proofs.requestProof(proofRequest)
  
  console.log(`✅ Proof request sent: ${proofRecord.id}`)
  console.log(`📊 Initial state: ${proofRecord.state}`)
  console.log(`💡 Check your wallet for: "Share your ${fieldName}"`)
  
  // Wait and monitor
  return monitorProof(proofRecord.id, fieldName)
}

async function monitorProof(proofId: string, fieldName: string) {
  const agent = getAgent()
  
  return new Promise((resolve) => {
    let checks = 0
    const maxChecks = 120 // 2 minutes
    
    const interval = setInterval(async () => {
      checks++
      try {
        const proof = await agent.proofs.getById(proofId)
        
        console.log(`⏱️ Check ${checks}/${maxChecks}: State = ${proof.state}`)
        
        if (proof.state === 'done') {
          clearInterval(interval)
          resolve({
            success: true,
            proofId,
            field: fieldName,
            verified: true,
            message: 'Proof verified!'
          })
        } else if (proof.state === 'presentation-received') {
          console.log('🎉 Proof received! Auto-accepting...')
          try {
            await agent.proofs.acceptPresentation({ proofRecordId: proofId })
            console.log('✅ Proof accepted')
          } catch (error) {
            console.error('❌ Auto-accept failed:', error)
          }
        } else if (proof.state === 'abandoned') {
          clearInterval(interval)
          resolve({
            success: false,
            proofId,
            error: proof.errorMessage || 'Proof abandoned'
          })
        }
        
        // Timeout
        if (checks >= maxChecks) {
          clearInterval(interval)
          resolve({
            success: false,
            proofId,
            error: 'Timeout',
            suggestion: 'Wallet did not respond. Please check: 1) Wallet is open 2) Check "Proof Requests" tab 3) Refresh wallet app'
          })
        }
      } catch (error:any) {
        console.log(`⚠️ Check ${checks} error:`, error.message)
      }
    }, 1000)
  })
}