"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const agent_js_1 = require("./agent/agent.js");
const invitation_js_1 = require("./agent/invitation.js");
const connected_Wallets_js_1 = require("./agent/connected_Wallets.js");
const connect_data_base_js_1 = require("./utils/connect_data_base.js");
const connection_Events_js_1 = require("./agent/connection_Events.js");
const register_Schema_js_1 = require("./agent/register_Schema.js");
const import_Bcovrin_Did_js_1 = require("./agent/import_Bcovrin_Did.js");
const publish_Schema_js_1 = require("./agent/publish_Schema.js");
const issue_Credentials_js_1 = require("./agent/issue_Credentials.js");
const proof_Events_js_1 = require("./agent/proof_Events.js");
const request_Proof_js_1 = require("./agent/request_Proof.js");
const create_Tenant_Wallet_js_1 = require("./agent/create_Tenant_Wallet.js");
const tenant_Event_Listener_js_1 = require("./agent/tenant_Event_Listener.js");
exports.app = (0, express_1.default)();
const PORT = process.env.Main_Port;
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
/**
 * 🔒 Routes are registered IMMEDIATELY
 */
exports.app.get('/', async (req, res) => {
    res.status(200).json({ message: "hello from credo agent" });
});
exports.app.get('/invite', async (request, res) => {
    try {
        const { userId } = request.body;
        const invitation = await (0, invitation_js_1.createInvitation)(userId);
        res.json(invitation);
    }
    catch (e) {
        res.status(503).json({
            error: 'Agent not ready',
        });
    }
});
exports.app.get('/wallets', (_req, res) => {
    res.json((0, connected_Wallets_js_1.getConnectedWallets)());
});
exports.app.get('/did', async (req, res) => {
    // const did = await getOrCreateIssuerDid()
    const did = await (0, import_Bcovrin_Did_js_1.importBCovrinDID)();
    return res.status(200).json({ did });
});
exports.app.post('/send-message', async (req, res) => {
    try {
        const { connectionId, message } = req.body;
        if (!connectionId || !message) {
            return res.status(400).json({ error: 'connectionId and message are required' });
        }
        const agent = (0, agent_js_1.getAgent)();
        await agent.basicMessages.sendMessage(connectionId, message);
        return res.json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ error: err.message });
    }
});
exports.app.post('/register-schema', async (req, res) => {
    try {
        // const schema = await registerSchema()
        const { schemaName, attributes } = req.body;
        const schema = await (0, register_Schema_js_1.registerEmployeeSchema)(schemaName, attributes);
        return res.status(200).json({ schema });
    }
    catch (err) {
        console.error('Error registering schema:', err);
        return res.status(500).json({ error: 'Failed to register schema' });
    }
});
exports.app.post('/schem-definition', async (req, res) => {
    try {
        const { schemaId } = req.body;
        const definition = await (0, publish_Schema_js_1.registerCredentialDefinition)(schemaId);
        return res.status(200).json({ definition });
    }
    catch (e) {
        console.error('Error registering schema:', e);
        return res.status(500).json({ error: 'Failed to register schema', message: e.message });
    }
});
exports.app.post('/issue-credentials', async (req, res) => {
    try {
        const { tenantId, connectionId, athlete_id, nationality, gender } = req.body;
        const issuing = await (0, issue_Credentials_js_1.issueCredentialToBCWallet)(tenantId, connectionId, athlete_id, nationality);
        return res.status(200).json({ issuing });
    }
    catch (e) {
        console.error('Error issuing schema:', e);
        return res.status(500).json({ error: 'Failed to issue schema', message: e.message });
    }
});
exports.app.post('/request-proof', async (req, res) => {
    try {
        const { connectionId } = req.body;
        const request = await (0, request_Proof_js_1.requestSimpleAttributeProof)(connectionId);
        return res.status(200).json({ request });
    }
    catch (e) {
        console.error('Error issuing schema:', e);
        return res.status(500).json({ error: 'Failed to issue schema', message: e.message });
    }
});
//creating a tenant wallet 
exports.app.post('/create-tenant-wallet', async (req, res) => {
    try {
        const { userId } = req.body;
        // Logic to create tenant wallet goes here
        // For demonstration, we'll just return a success message
        const tenant = await (0, create_Tenant_Wallet_js_1.createTenantWalletAndConnect)(userId);
        return res.status(200).json({ message: `Tenant wallet for ${userId} created successfully`, tenant });
    }
    catch (e) {
        console.error('Error creating tenant wallet:', e);
        return res.status(500).json({ error: 'Failed to create tenant wallet', message: e.message });
    }
});
//1
//2
//3
// app.get('/', (_req, res) => {
//   res.send('SSI Agent running')
// })
/**
 *
 */
exports.app.listen(PORT, async () => {
    await (0, connect_data_base_js_1.connect)();
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
(async () => {
    try {
        await (0, agent_js_1.initializeAgent)();
        (0, connected_Wallets_js_1.registerConnectionListeners)();
        await (0, connection_Events_js_1.registerCredentialEventHandlers)();
        (0, proof_Events_js_1.setupWorkingProofListener)();
        (0, tenant_Event_Listener_js_1.startDynamicTenantListener)();
    }
    catch (e) {
        console.error('❌ Agent failed to initialize', e);
    }
})();
//# sourceMappingURL=index.js.map