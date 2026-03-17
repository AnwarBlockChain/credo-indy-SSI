"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAgent = initializeAgent;
exports.getAgent = getAgent;
const core_1 = require("@credo-ts/core");
const node_1 = require("@credo-ts/node");
const askar_1 = require("@credo-ts/askar");
const aries_askar_nodejs_1 = require("@hyperledger/aries-askar-nodejs");
const anoncreds_nodejs_1 = require("@hyperledger/anoncreds-nodejs");
const anoncreds_1 = require("@credo-ts/anoncreds");
const indy_vdr_1 = require("@credo-ts/indy-vdr");
const indy_vdr_nodejs_1 = require("@hyperledger/indy-vdr-nodejs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const genesisPath = path_1.default.join(__dirname, 'ledgers', 'builder-genesis.txn');
const genesisTransactions = fs_1.default.readFileSync(genesisPath, 'utf8');
let agent = null;
const agentPort = Number(process.env.Agent_Port) || 3001;
async function initializeAgent() {
    if (agent)
        return agent;
    const config = {
        label: 'docs-agent-nodejs',
        logger: new core_1.ConsoleLogger(core_1.LogLevel.debug),
        endpoints: [agentPort.toString()], // public DIDComm endpoint
        walletConfig: {
            id: 'wallet-id-v2',
            key: 'testkey0000000000000000000000000'
        },
    };
    agent = new core_1.Agent({
        config,
        dependencies: node_1.agentDependencies,
        modules: {
            askar: new askar_1.AskarModule({ ariesAskar: aries_askar_nodejs_1.ariesAskar }),
            indyVdr: new indy_vdr_1.IndyVdrModule({
                indyVdr: indy_vdr_nodejs_1.indyVdr,
                networks: [
                    {
                        isProduction: false,
                        indyNamespace: 'bcovrin:test',
                        genesisTransactions: genesisTransactions,
                        connectOnStartup: true,
                    },
                ],
            }),
            anoncreds: new anoncreds_1.AnonCredsModule({
                registries: [new indy_vdr_1.IndyVdrAnonCredsRegistry()],
                anoncreds: anoncreds_nodejs_1.anoncreds,
            }),
            credentials: new core_1.CredentialsModule({
                credentialProtocols: [
                    new anoncreds_1.V1CredentialProtocol({
                        indyCredentialFormat: new anoncreds_1.LegacyIndyCredentialFormatService(),
                    }),
                    new core_1.V2CredentialProtocol({ credentialFormats: [new anoncreds_1.AnonCredsCredentialFormatService()] }),
                ],
            }),
            connections: new core_1.ConnectionsModule({
                autoAcceptConnections: true,
            }),
            dids: new core_1.DidsModule({
                resolvers: [new core_1.KeyDidResolver(), new core_1.PeerDidResolver(), new core_1.JwkDidResolver(), new indy_vdr_1.IndyVdrSovDidResolver(), new indy_vdr_1.IndyVdrIndyDidResolver()],
                // Register registrars
                registrars: [new core_1.KeyDidRegistrar(), new core_1.PeerDidRegistrar(), new indy_vdr_1.IndyVdrIndyDidRegistrar()]
            }),
            proofs: new core_1.ProofsModule({
                proofProtocols: [
                    new core_1.V2ProofProtocol({
                        proofFormats: [
                            new anoncreds_1.AnonCredsProofFormatService(), // This is required for AnonCreds proofs
                        ]
                    })
                ]
            }),
            oob: new core_1.OutOfBandModule(),
            mediator: new core_1.MediatorModule({
                autoAcceptMediationRequests: true, // <-- Auto-accept requests from wallets
            }),
        },
    });
    // Inbound/outbound transports
    agent.registerOutboundTransport(new core_1.HttpOutboundTransport());
    agent.registerOutboundTransport(new core_1.WsOutboundTransport());
    agent.registerInboundTransport(new node_1.HttpInboundTransport({ port: agentPort }));
    agent.registerInboundTransport(new node_1.WsInboundTransport({ port: 3002 }));
    // Listen for inbound messages
    agent.events.on('InboundMessageReceived', (event) => {
        console.log('🔔 Inbound message:', event.type, event.message);
    });
    agent.events.on('TenantAgentContextCreated', (event) => {
        console.log('🏢 Tenant agent context created:', event.tenantId);
    });
    agent.events.on('TenantAgentContextDestroyed', (event) => {
        console.log('🏢 Tenant agent context destroyed:', event.tenantId);
    });
    await agent.initialize();
    console.log('✅ Agent initialized for Indy V1');
    return agent;
}
function getAgent() {
    if (!agent)
        throw new Error('Agent not initialized');
    return agent;
}
//# sourceMappingURL=agent.js.map