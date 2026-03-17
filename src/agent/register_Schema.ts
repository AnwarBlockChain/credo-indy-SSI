// schema-registration.ts
import { getAgent } from "./agent.ts"

export async function registerEmployeeSchema(schemaName:any,attributes:string[]) {
  try {
    console.log('📝 Registering EmployeeCredential schema...')
    const agent = getAgent()
    
    const schemaResult = await agent.modules.anoncreds.registerSchema({
      schema: {
        issuerId: "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ",
        name: schemaName,
        version: '1.0.0',
        attrNames: attributes,
      },
      options: {},
    })
    
    console.log('📊 Schema State:', schemaResult.schemaState.state)
    
    if (schemaResult.schemaState.state === 'failed') {
      throw new Error(`Schema registration failed: ${schemaResult.schemaState.reason}`)
    }
    
    if (!schemaResult.schemaState.schemaId) {
      throw new Error('Schema ID not returned')
    }
    
    console.log(`Schema registered: ${schemaResult.schemaState.schemaId}`)
    return schemaResult.schemaState.schemaId
    
  } catch (error) {
    console.error('Failed to register schema:', error)
    throw error
  }
}