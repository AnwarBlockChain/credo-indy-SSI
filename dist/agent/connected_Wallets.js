"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnectionListeners = registerConnectionListeners;
exports.getConnectedWallets = getConnectedWallets;
const agent_js_1 = require("./agent.js");
const core_1 = require("@credo-ts/core");
const wallet_js_1 = __importDefault(require("../schems/wallet.js")); // <-- use your mongoose model
const connectedWallets = {};
function registerConnectionListeners() {
    const agent = (0, agent_js_1.getAgent)();
    agent.events.on(core_1.ConnectionEventTypes.ConnectionStateChanged, async (event) => {
        const { connectionRecord } = event.payload;
        console.log('🔗 Connection state:', connectionRecord.state);
        // ✅ USE THE INSTANCE
        if (connectionRecord.state === 'request-received') {
            console.log('➡️ Connection request received! Accepting..............');
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            console.log(`a`);
            await wallet_js_1.default.findOneAndUpdate({ connectionId: connectionRecord.id }, {
                connectionId: connectionRecord.id,
                publicKey: connectionRecord.theirDid,
                label: connectionRecord.theirLabel,
                state: connectionRecord.state,
                connectedAt: new Date(),
            }, { upsert: true, new: true });
            await agent.connections.acceptRequest(connectionRecord.id);
        }
        if (connectionRecord.state === 'completed') {
            console.log('✅ Wallet connected:', connectionRecord.theirDid);
            // const userId = connectionRecord.metadata.userId
            //below meta data line
            //      const qrToken = (await getAgent().oob.findById(connectionRecord.outOfBandId!))
            // ?.outOfBandInvitation?.appendedAttachments?.[0]
            // ?.getDataAsJson<{ qrToken: string }>()?.qrToken
            // console.log(`the qr token found in meta data `, qrToken)
            // if (!qrToken) {
            //   console.warn('No QR token found in metadata!')
            //   return
            // }
            console.log(`the qr token found in meta data `);
            connectedWallets[connectionRecord.id] = connectionRecord;
            //  await ConnectedWallet.findOneAndUpdate(
            //   { connectionId: connectionRecord.id },
            //   {
            //     connectionId: connectionRecord.id,
            //     publicKey: connectionRecord.theirDid,
            //     label: connectionRecord.theirLabel,
            //     state: connectionRecord.state,
            //     connectedAt: new Date(),
            //   },
            //   { upsert: true, new: true }
            // )
            console.log('💾 Connection saved to DB:', connectionRecord.theirDid);
        }
    });
}
function getConnectedWallets() {
    return connectedWallets;
}
//# sourceMappingURL=connected_Wallets.js.map