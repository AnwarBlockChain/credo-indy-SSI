import { KeyType, TypedArrayEncoder } from "@credo-ts/core"
import { getAgent } from "./agent.ts"




export async function importBCovrinDID(seed = "pakistanisbeautifulcountrythisne", unqualifiedDid="H3TxE3xVbec7ZDc42gBZTQ") {
  try {
    console.log('🔑 Importing BCovrin DID...')
    const agent = getAgent()
    const seedBytes = TypedArrayEncoder.fromString(seed)
    const fullDid = `did:indy:bcovrin:test:${unqualifiedDid}`
    // did:sov:TGD2XKrVHLXkMKQEXG7PL9
    await agent.dids.import({
      did: fullDid,
      overwrite: true,
      privateKeys: [
        {
          privateKey: seedBytes,
          keyType: KeyType.Ed25519,
        },
      ],
    })
    
    console.log(`✅ Imported DID: ${fullDid}`)
    return fullDid
    
  } catch (error) {
    console.error('❌ Failed to import DID:', error)
    throw error
  }
}