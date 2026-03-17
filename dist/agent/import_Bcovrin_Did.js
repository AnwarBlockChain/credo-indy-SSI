"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importBCovrinDID = importBCovrinDID;
const core_1 = require("@credo-ts/core");
const agent_js_1 = require("./agent.js");
async function importBCovrinDID(seed = "pakistanisbeautifulcountrythisne", unqualifiedDid = "H3TxE3xVbec7ZDc42gBZTQ") {
    try {
        console.log('🔑 Importing BCovrin DID...');
        const agent = (0, agent_js_1.getAgent)();
        const seedBytes = core_1.TypedArrayEncoder.fromString(seed);
        const fullDid = `did:indy:bcovrin:test:${unqualifiedDid}`;
        // did:sov:TGD2XKrVHLXkMKQEXG7PL9
        await agent.dids.import({
            did: fullDid,
            overwrite: true,
            privateKeys: [
                {
                    privateKey: seedBytes,
                    keyType: core_1.KeyType.Ed25519,
                },
            ],
        });
        console.log(`✅ Imported DID: ${fullDid}`);
        return fullDid;
    }
    catch (error) {
        console.error('❌ Failed to import DID:', error);
        throw error;
    }
}
//# sourceMappingURL=import_Bcovrin_Did.js.map