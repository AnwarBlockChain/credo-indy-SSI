"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTenant = registerTenant;
exports.registerConnection = registerConnection;
exports.startDynamicTenantListener = startDynamicTenantListener;
const agent_1 = require("./agent");
// Maps to resolve inbound messages dynamically
const recipientKeyToTenantId = {};
const connectionToTenantId = {};
/**
 * Register a tenant dynamically
 * @param tenantId - internal tenant identifier
 * @param tenantWalletKey - tenant wallet recipient key
 */
function registerTenant(tenantId, tenantWalletKey) {
    recipientKeyToTenantId[tenantWalletKey] = tenantId;
}
/**
 * Optional: Register connection -> tenantId mapping after connection creation
 */
function registerConnection(tenantId, connectionId) {
    connectionToTenantId[connectionId] = tenantId;
}
/**
 * Listen for all connection and message events dynamically
 */
function startDynamicTenantListener() {
    const rootAgent = (0, agent_1.getAgent)();
    console.log(`tenant message events`);
    // -------------------------
    // RoutingKeyCreated
    // -------------------------
    rootAgent.events.on('RoutingKeyCreated', async (event) => {
        const tenantId = event.tenantId;
        const recipientKey = event.recipientKey;
        console.log(`🔑 Routing key created for tenant ${tenantId}: ${recipientKey}`);
        registerTenant(tenantId, recipientKey);
    });
    // -------------------------
    // AgentMessageReceived
    // -------------------------
    rootAgent.events.on('AgentMessageReceived', async (inboundMessage) => {
        const key = inboundMessage?.recipientKey?.publicKeyBase58;
        const tenantId = key ? recipientKeyToTenantId[key] : undefined;
        if (!tenantId) {
            console.warn('⚠️ Could not resolve tenant for inbound message:', inboundMessage?.type);
            return;
        }
        // Acquire tenant agent dynamically
        const tenantAgent = await rootAgent.modules.tenants.getTenantAgent(tenantId);
        console.log(`📩 Inbound message routed to tenant ${tenantId}: ${inboundMessage?.type}`);
        // Let tenant agent handle the message
        await tenantAgent.receiveMessage(inboundMessage);
    });
    // -------------------------
    // ConnectionStateChanged
    // -------------------------
    rootAgent.events.on('ConnectionStateChanged', (event) => {
        const tenantId = event.tenantId || connectionToTenantId[event.connectionId];
        if (!tenantId)
            return;
        console.log(`🔗 Tenant ${tenantId} connection state: ${event.connectionState}`);
    });
}
//# sourceMappingURL=tenant_Event_Listener.js.map