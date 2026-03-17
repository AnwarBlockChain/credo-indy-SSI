"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCredentialEventHandlers = registerCredentialEventHandlers;
const core_1 = require("@credo-ts/core");
const agent_js_1 = require("./agent.js");
async function registerCredentialEventHandlers() {
    const agent = (0, agent_js_1.getAgent)();
    agent.events.on(core_1.CredentialEventTypes.CredentialStateChanged, async (event) => {
        const { credentialRecord } = event.payload;
        console.log('========================================');
        console.log(`🎫 Credential Event Details:`);
        console.log(`   ID: ${credentialRecord.id}`);
        console.log(`   State: ${credentialRecord.state}`);
        console.log(`   Connection ID: ${credentialRecord.connectionId}`);
        console.log(`   Protocol Version: ${credentialRecord.protocolVersion}`);
        console.log(`   Thread ID: ${credentialRecord.threadId}`);
        console.log('========================================');
        try {
            switch (credentialRecord.state) {
                case core_1.CredentialState.OfferSent:
                    console.log('✅ Offer sent, waiting for holder to accept...');
                    break;
                case core_1.CredentialState.RequestReceived:
                    console.log('➡️ REQUEST RECEIVED from wallet! Issuing credential...');
                    await agent.credentials.acceptRequest({
                        credentialRecordId: credentialRecord.id,
                    });
                    console.log('✅ Credential issued successfully');
                    break;
                case core_1.CredentialState.Done:
                    console.log('✅ Credential exchange completed');
                    break;
                default:
                    console.log(`ℹ️ Credential state: ${credentialRecord.state}`);
            }
        }
        catch (error) {
            console.error('❌ Credential flow error:', error);
        }
    });
    console.log('✅ Credential event handlers registered');
}
//# sourceMappingURL=connection_Events.js.map