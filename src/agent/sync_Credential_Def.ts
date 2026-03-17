import { getAgent } from "./agent"

export async function syncCredDefToTenant(
  tenantId: string,
  credentialDefinitionId: string
) {
  const rootAgent = getAgent()
  const tenantAgent = await rootAgent.modules.tenants.getTenantAgent({ tenantId })

  // 1️⃣ Check if tenant already has record
  const existing = await tenantAgent.modules.anoncreds.findCredentialDefinitions({
    credentialDefinitionId
  })

  if (existing.length > 0) {
    console.log("ℹ️ Tenant already has credential definition")
    return
  }

  // 2️⃣ Fetch from root wallet
  const rootCredDef =
    await rootAgent.modules.anoncreds.getCredentialDefinition({
      credentialDefinitionId
    })

  // 3️⃣ Import SAME cred def record into tenant wallet
  await tenantAgent.modules.anoncreds.registerCredentialDefinition({
    credentialDefinition: rootCredDef
  })

  console.log(`✅ Credential Definition registered in tenant wallet`)
  return true
}
