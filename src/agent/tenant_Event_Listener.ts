import { getAgent } from './agent'

// Maps to resolve inbound messages dynamically
const recipientKeyToTenantId: Record<string, string> = {}
const connectionToTenantId: Record<string, string> = {}

/**
 * Register a tenant dynamically
 * @param tenantId - internal tenant identifier
 * @param tenantWalletKey - tenant wallet recipient key
 */
export function registerTenant(tenantId: string, tenantWalletKey: string) {
  recipientKeyToTenantId[tenantWalletKey] = tenantId
}

/**
 * Optional: Register connection -> tenantId mapping after connection creation
 */
export function registerConnection(tenantId: string, connectionId: string) {
  connectionToTenantId[connectionId] = tenantId
}

/**
 * Listen for all connection and message events dynamically
 */
export function startDynamicTenantListener() {
  const rootAgent = getAgent()
  console.log(`tenant message events`)
  // -------------------------
  // RoutingKeyCreated
  // -------------------------
  rootAgent.events.on('RoutingKeyCreated', async (event: any) => {
    const tenantId: string = event.tenantId
    const recipientKey: string = event.recipientKey

    console.log(`🔑 Routing key created for tenant ${tenantId}: ${recipientKey}`)
    registerTenant(tenantId, recipientKey)
  })

  // -------------------------
  // AgentMessageReceived
  // -------------------------
  rootAgent.events.on('AgentMessageReceived', async (inboundMessage: any) => {
    const key = inboundMessage?.recipientKey?.publicKeyBase58
    const tenantId = key ? recipientKeyToTenantId[key] : undefined

    if (!tenantId) {
      console.warn('⚠️ Could not resolve tenant for inbound message:', inboundMessage?.type)
      return
    }

    // Acquire tenant agent dynamically
    const tenantAgent = await rootAgent.modules.tenants.getTenantAgent(tenantId)
    console.log(`📩 Inbound message routed to tenant ${tenantId}: ${inboundMessage?.type}`)

    // Let tenant agent handle the message
    await tenantAgent.receiveMessage(inboundMessage)
  })

  // -------------------------
  // ConnectionStateChanged
  // -------------------------
  rootAgent.events.on('ConnectionStateChanged', (event: any) => {
    const tenantId = event.tenantId || connectionToTenantId[event.connectionId]
    if (!tenantId) return

    console.log(`🔗 Tenant ${tenantId} connection state: ${event.connectionState}`)
  })
}
