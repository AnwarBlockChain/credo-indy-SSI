"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantWalletAndConnect = createTenantWalletAndConnect;
const agent_1 = require("./agent");
const jsonStringifyCircular = (obj) => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular Reference]';
            }
            seen.add(value);
        }
        return value;
    }, 2);
};
// export async function createTenantWalletAndConnect(userId: string) {
//   const rootAgent = getAgent()
//   const tenantLabel = `tenant-${userId}`
//   // 1️⃣ Create tenant wallet and get tenant record
//   const tenantRecord = await rootAgent.modules.tenants.createTenant({
//     config: {
//       label: tenantLabel,
//       walletConfig: {
//         id: `wallet-${userId}`,
//         key: `key-${userId}-${Date.now()}`,
//         keyDerivationMethod: 'RAW'
//       },
//     },
//   })
//   // 2️⃣ Get tenant agent
//   console.log(`the tenant id is ${tenantRecord.id} and the whole tenant record is ${JSON.stringify(tenantRecord)}`)
//   const tenantAgent = await rootAgent.modules.tenants.getTenantAgent({ tenantId: tenantRecord.id })
//   console.log(`the tenant agent is ${tenantAgent}`)
//   // 3️⃣ Root agent creates OOB invitation
//   const invitation = await rootAgent.oob.createInvitation({
//     label: 'Root → Tenant Connection',
//      autoAcceptConnection: true,
//   })
//   const oobRecord = await rootAgent.oob.findById(invitation.id)
// console.log("OOB Record:", oobRecord)
//   // 4️⃣ Tenant wallet receives invitation
//   // const { oobRecord, connectionRecord } = await tenantAgent.oob.receiveInvitation(
//   //   invitation.outOfBandInvitation,
//   //   { autoAcceptConnection: true } 
//   // )
//   const { oobRecord: tenantOob, connectionRecord } = await tenantAgent.oob.receiveInvitation(
//   invitation.outOfBandInvitation,
//   { autoAcceptConnection: true } 
// )
//   console.log(`the invitation has been recieved`)
//   console.log(`the connection record is ${JSON.stringify(connectionRecord, null, 2)}`)
//   console.log(`the invitation is ${JSON.stringify(invitation, null, 2)}`)
//   console.log(`and the invitation id is ${invitation.id}`)
//   // console.log(`the tenant agent is ${jsonStringifyCircular(tenantAgent)}`)
//   // const rootConnections = await rootAgent.connections.findAllByOutOfBandId(
//   //   invitation.id
//   // )
//   console.log(`the oob record is ${JSON.stringify(oobRecord)}`)
//   const rootConnections = await rootAgent.connections.findAllByOutOfBandId(
//   invitation.id
// )
// console.log(`the root connections is ${JSON.stringify(rootConnections, null, 2)}`)
//   if (!rootConnections || rootConnections.length === 0) {
//     throw new Error(
//       `Root agent has no connection for outOfBandId ${oobRecord.id}`
//     )
//   }
//   const rootConnection = rootConnections[0]
//   // 6️⃣ Accept tenant's connection request on root side
//   const completedConnection = await rootAgent.connections.acceptRequest(
//     rootConnection.id
//   )
//   console.log(`the accepted connection is ${completedConnection}`)
//   console.log(
//     `Tenant wallet created: id=${tenantRecord.id}, connectionId=${connectionRecord.id}`
//   )
//   const all_Tenants = await rootAgent.modules.tenants.getAllTenants()
//   console.log(`All tenants: ${JSON.stringify(all_Tenants)}`)
//   return {
//     tenantId: tenantRecord.id,
//     connectionId: connectionRecord.id,
//     label: tenantLabel
//   }
// }
// export async function createTenantWalletAndConnect(userId: string) {
//   const rootAgent = getAgent()
//   // 1️⃣ Create tenant wallet
//   const tenantRecord = await rootAgent.modules.tenants.createTenant({
//     config: {
//       label: `tenant-${userId}`,
//       endpoints: rootAgent.config.endpoints,
//       walletConfig: { id: `wallet-${userId}`, key: `key-${userId}` },
//     },
//   })
//   // 2️⃣ Get tenant agent
//   const tenantAgent = await rootAgent.modules.tenants.getTenantAgent({ tenantId: tenantRecord.id })
//   tenantAgent.config.autoAcceptConnections = true
//   // 3️⃣ Root creates OOB invitation
//   const invitation = await rootAgent.oob.createInvitation({
//     label: 'Root → Tenant Connection',
//     autoAcceptConnection: true, // root side will auto accept requests
//   })
//   console.log('OOB Invitation created. Tenant can scan QR.')
//   // 4️⃣ Tenant receives invitation and auto-accepts
//   const { connectionRecord: tenantConnection } = await tenantAgent.oob.receiveInvitation(
//     invitation.outOfBandInvitation,
//     { autoAcceptConnection: true } // tenant side auto accepts
//   )
//   const completedConnection =
//   await tenantAgent.connections.returnWhenIsConnected(
//     tenantConnection.id
//   )
//   console.log('Tenant connection established. Connection ID:', tenantConnection.id)
//   console.log(tenantConnection.state)
//   console.log(completedConnection)
//   // 5️⃣ Return info
//   return {
//     tenantId: tenantRecord.id,
//     tenantConnectionId: tenantConnection.id,
//     invitationUrl: invitation.outOfBandInvitation.toUrl({ domain: 'https://a44d8038056c.ngrok-free.app' }),
//   }
// }
async function createTenantWalletAndConnect(userId) {
    const rootAgent = (0, agent_1.getAgent)();
    // 1️⃣ Create tenant with custodial wallet
    const tenant = await rootAgent.modules.tenants.createTenant({
        config: { label: `tenant-${userId}` } // connectionImageUrl optional
    });
    // tenant.wallet is automatically created with default walletConfig
    console.log(`the tenant is ${tenant} and is tenant ${jsonStringifyCircular(tenant)}`);
    // 2️⃣ Return identifiers for storage
    return {
        tenantId: tenant.id,
        walletId: tenant.config.walletConfig.id, // <-- wallet info is here
        walletKey: tenant.config.walletConfig.key
    };
}
//# sourceMappingURL=create_Tenant_Wallet.js.map