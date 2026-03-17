import { getAgent } from './agent'

export async function getOrCreateIssuerDid(): Promise<string> {
  const agent = getAgent()
  
  console.log('\n=== Getting/Creating Issuer DID ===')
  
  // Your existing BCovrin credentials
  const existingShortDid = 'H3TxE3xVbec7ZDc42gBZTQ'
  const seed = 'pakistanisbeautifulcountrythisne'
  
  // Try to IMPORT your existing DID, not create new
  console.log(`Importing existing DID: did:sov:${existingShortDid}`)
  
  try {
    // Method 1: Check if DID already in wallet
    const existingDids = await agent.dids.getCreatedDids()
    const foundDid = existingDids.find((d: any) => 
      d.did === `did:sov:${existingShortDid}` || d.did.includes(existingShortDid)
    )
    
    if (foundDid) {
      console.log(`✅ DID already in wallet: ${foundDid.did}`)
      return foundDid.did
    }
    
    // Method 2: Try to import using the seed with the existing DID
    const result = await agent.dids.create({
      method: 'indy',
      options: {
        seed: seed,
        did: existingShortDid, // CRITICAL: Tell it to use existing DID
        alias: 'UniversityIssuer',
        role: 'ENDORSER'
      }
    })
    
    console.log('Import result:', result.didState.state)
    
    if (result.didState.did) {
      console.log(`✅ Imported existing DID: ${result.didState.did}`)
      return result.didState.did
    }
    
  } catch (error: any) {
    console.log('Import failed, using DID directly:', error.message)
  }
  
  // Method 3: Just use the DID string (it's on ledger)
  console.log('Using DID directly from ledger...')
  return `did:sov:${existingShortDid}`
}