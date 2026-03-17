"use strict";
// // issue-credential.ts
// import { getAgent } from "./agent.ts"
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCredentialToBCWallet = issueCredentialToBCWallet;
// export async function issueCredentialToBCWallet(
//   connectionId:any,
//   athlete_id:string,
//   nationality:string,
//   gender:string
// ) {
//   try {
//     const agent = getAgent()
//     const credentialDefinitionId = "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ/anoncreds/v0/CLAIM_DEF/3052411/default"
//     console.log('🎫 Issuing credential to BC Wallet...')
//     console.log(`🔗 Connection ID: ${connectionId}`)
//     console.log(`🔐 Credential Definition ID: ${credentialDefinitionId}`)
//     // First, verify the connection
//     const connection = await agent.connections.getById(connectionId)
//     if (connection.state !== 'completed') {
//       throw new Error(`Connection is not active. Current state: ${connection.state}`)
//     }
//     console.log(`✅ Connection verified with: ${connection.theirLabel || 'Unknown Wallet'}`)
//     // Issue the credential using V1 protocol (BC Wallet expects this)
//     const credentialRecord = await agent.credentials.offerCredential({
//       //@ts-ignore
//       protocolVersion: 'v2', // ⚠️ BC Wallet uses V1
//       connectionId,
//       credentialFormats: {
//         anoncreds: {
//           credentialDefinitionId,
//           attributes: [
//             { name: 'athlete_id', value: athlete_id },
//             { name: 'nationality', value: nationality },
//             { name: 'gender', value: gender },
//             { name: 'level', value: "professional" }
//           ],
//         }
//       },
//       comment: 'Welcome to our organization!',
//     })
//     console.log(`✅ Credential offer sent with ID: ${credentialRecord.id}`)
//     console.log(`🧵 Thread ID: ${credentialRecord.threadId}`)
//     return credentialRecord
//   } catch (error) {
//     console.error('❌ Failed to issue credential:', error)
//     throw error
//   }
// }
//tenant wallet 
const core_1 = require("@credo-ts/core");
const agent_1 = require("./agent");
// export async function issueCredentialToBCWallet(
//   tenantId: string,
//   athlete_id: string,
//   nationality: string,
//   gender: string
// ) {
//       const rootAgent = getAgent()
//   return await rootAgent.modules.tenants.withTenantAgent(
//     { tenantId },
//     async (tenantAgent: any) => {
//       tenantAgent.config.autoAcceptCredentials = true
//       const credentialDefinitionId =
//         "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ/anoncreds/v0/CLAIM_DEF/3094094/default"
//       // 1️⃣ Create a self OOB invitation
//       const oob = await tenantAgent.oob.createInvitation({
//         label: "self-connection",
//         autoAccept: true,
//       })
//       // 2️⃣ Accept your own invitation to create a connection
//       // ⚠️ Must provide the handshake protocol
//       const selfConnection = await tenantAgent.connections.acceptOutOfBandInvitation(oob, {
//         autoAcceptConnection: true,
//         protocol: HandshakeProtocol.Connections, // <-- required
//       })
//       // 3️⃣ Offer the credential using this self-connection
//       const credentialRecord = await tenantAgent.credentials.offerCredential({
//         protocolVersion: "v2",
//         connectionId: selfConnection.id,
//         credentialFormats: {
//           anoncreds: {
//             credentialDefinitionId,
//             attributes: [
//               { name: "athlete_id", value: athlete_id },
//               { name: "nationality", value: nationality },
//               { name: "gender", value: gender },
//               { name: "level", value: "professional" },
//             ],
//           },
//         },
//         comment: "Issued via custodial SSI (self-connection)",
//       })
//       console.log(`✅ Credential issued in tenant wallet: ${credentialRecord.id}`)
//       return credentialRecord
//     }
//   )
// }
//SSI focused 
async function issueCredentialToBCWallet(tenantId, athlete_id, nationality, gender) {
    const rootAgent = (0, agent_1.getAgent)();
    return await rootAgent.modules.tenants.withTenantAgent({ tenantId }, async (tenantAgent) => {
        tenantAgent.config.autoAcceptCredentials = true;
        const credentialDefinitionId = "did:indy:bcovrin:test:H3TxE3xVbec7ZDc42gBZTQ/anoncreds/v0/CLAIM_DEF/3094094/default";
        // 1️⃣ Create a self OOB invitation
        const oob = await tenantAgent.oob.createInvitation({
            label: "self-connection",
            autoAccept: true,
        });
        // 2️⃣ Accept your own invitation to create a connection
        // ⚠️ Must provide the handshake protocol
        const selfConnection = await tenantAgent.connections.acceptOutOfBandInvitation(oob, {
            autoAcceptConnection: true,
            protocol: core_1.HandshakeProtocol.Connections, // <-- required
        });
        // 3️⃣ Offer the credential using this self-connection
        const credentialRecord = await tenantAgent.credentials.offerCredential({
            protocolVersion: "v2",
            connectionId: selfConnection.id,
            credentialFormats: {
                anoncreds: {
                    credentialDefinitionId,
                    attributes: [
                        { name: "athlete_id", value: athlete_id },
                        { name: "nationality", value: nationality },
                        { name: "gender", value: gender },
                        { name: "level", value: "professional" },
                    ],
                },
            },
            comment: "Issued via custodial SSI (self-connection)",
        });
        console.log(`✅ Credential issued in tenant wallet: ${credentialRecord.id}`);
        return credentialRecord;
    });
}
//# sourceMappingURL=issue_Credentials.js.map