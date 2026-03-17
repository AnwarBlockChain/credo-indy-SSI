"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCredDefToTenant = syncCredDefToTenant;
const agent_1 = require("./agent");
async function syncCredDefToTenant(tenantId, credentialDefinitionId) {
    const rootAgent = (0, agent_1.getAgent)();
    const tenantAgent = await rootAgent.modules.tenants.getTenantAgent({ tenantId });
    // 1️⃣ Check if tenant already has record
    const existing = await tenantAgent.modules.anoncreds.findCredentialDefinitions({
        credentialDefinitionId
    });
    if (existing.length > 0) {
        console.log("ℹ️ Tenant already has credential definition");
        return;
    }
    // 2️⃣ Fetch from root wallet
    const rootCredDef = await rootAgent.modules.anoncreds.getCredentialDefinition({
        credentialDefinitionId
    });
    // 3️⃣ Import SAME cred def record into tenant wallet
    await tenantAgent.modules.anoncreds.registerCredentialDefinition({
        credentialDefinition: rootCredDef
    });
    console.log(`✅ Credential Definition registered in tenant wallet`);
    return true;
}
//# sourceMappingURL=sync_Credential_Def.js.map