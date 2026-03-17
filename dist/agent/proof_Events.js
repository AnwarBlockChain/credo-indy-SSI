"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWorkingProofListener = setupWorkingProofListener;
// working-proof-listener.ts
const agent_js_1 = require("./agent.js");
function setupWorkingProofListener() {
    const agent = (0, agent_js_1.getAgent)();
    // CORRECT: Listen to all events with a wildcard
    agent.events.on('*', (event) => {
        const eventType = event.type;
        // Filter for proof-related events
        if (eventType.includes('Proof') || eventType.includes('proof')) {
            console.log(`🔍 Proof-related event: ${eventType}`);
            if (event.payload?.proofRecord) {
                const proof = event.payload.proofRecord;
                console.log(`📊 Proof ${proof.id} - State: ${proof.state}`);
                // Auto-accept when proof is presented
                if (proof.state === 'presentation-received') {
                    handleProofPresentation(proof.id);
                }
            }
        }
    });
    console.log('✅ Proof listener active (listening to all events)');
}
async function handleProofPresentation(proofId) {
    try {
        const agent = (0, agent_js_1.getAgent)();
        console.log(`🎉 Auto-accepting proof ${proofId}...`);
        await agent.proofs.acceptPresentation({
            proofRecordId: proofId
        });
        console.log(`✅ Proof ${proofId} accepted`);
    }
    catch (error) {
        console.error(`❌ Failed to accept proof ${proofId}:`, error);
    }
}
//# sourceMappingURL=proof_Events.js.map