"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCredentialDefinition = registerCredentialDefinition;
// cred-def-registration.ts
const agent_js_1 = require("./agent.js");
async function registerCredentialDefinition(schemaId) {
    try {
        console.log('📋 Registering credential definition...');
        const agent = (0, agent_js_1.getAgent)();
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
        });
        console.log('📊 Credential Definition State:', credentialDefinitionResult.credentialDefinitionState.state);
        if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
            throw new Error(`Credential definition registration failed: ${credentialDefinitionResult.credentialDefinitionState.reason}`);
        }
        if (!credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId) {
            throw new Error('Credential definition ID not returned');
        }
        console.log(`✅ Credential definition registered: ${credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId}`);
        return credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId;
    }
    catch (error) {
        console.error('❌ Failed to register credential definition:', error);
        throw error;
    }
}
//# sourceMappingURL=publish_Schema.js.map