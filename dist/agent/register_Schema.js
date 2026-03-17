"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEmployeeSchema = registerEmployeeSchema;
// schema-registration.ts
const agent_js_1 = require("./agent.js");
async function registerEmployeeSchema(schemaName, attributes) {
    try {
        console.log('📝 Registering EmployeeCredential schema...');
        const agent = (0, agent_js_1.getAgent)();
        const schemaResult = await agent.modules.anoncreds.registerSchema({
            schema: {
                issuerId: "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ",
                name: schemaName,
                version: '1.0.0',
                attrNames: attributes,
            },
            options: {},
        });
        console.log('📊 Schema State:', schemaResult.schemaState.state);
        if (schemaResult.schemaState.state === 'failed') {
            throw new Error(`Schema registration failed: ${schemaResult.schemaState.reason}`);
        }
        if (!schemaResult.schemaState.schemaId) {
            throw new Error('Schema ID not returned');
        }
        console.log(`Schema registered: ${schemaResult.schemaState.schemaId}`);
        return schemaResult.schemaState.schemaId;
    }
    catch (error) {
        console.error('Failed to register schema:', error);
        throw error;
    }
}
//# sourceMappingURL=register_Schema.js.map