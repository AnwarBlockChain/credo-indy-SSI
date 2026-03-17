// working-proof-listener.ts
import { getAgent } from "./agent.ts"

export function setupWorkingProofListener() {
  const agent = getAgent()
  
  // CORRECT: Listen to all events with a wildcard
  agent.events.on('*' as any, (event: any) => {
    const eventType = event.type
    
    // Filter for proof-related events
    if (eventType.includes('Proof') || eventType.includes('proof')) {
      console.log(`🔍 Proof-related event: ${eventType}`)
      
      if (event.payload?.proofRecord) {
        const proof = event.payload.proofRecord
        console.log(`📊 Proof ${proof.id} - State: ${proof.state}`)
        
        // Auto-accept when proof is presented
        if (proof.state === 'presentation-received') {
          handleProofPresentation(proof.id)
        }
      }
    }
  })
  
  console.log('✅ Proof listener active (listening to all events)')
}

async function handleProofPresentation(proofId: string) {
  try {
    const agent = getAgent()
    
    console.log(`🎉 Auto-accepting proof ${proofId}...`)
    
    await agent.proofs.acceptPresentation({
      proofRecordId: proofId
    })
    
    console.log(`✅ Proof ${proofId} accepted`)
    
  } catch (error) {
    console.error(`❌ Failed to accept proof ${proofId}:`, error)
  }
}