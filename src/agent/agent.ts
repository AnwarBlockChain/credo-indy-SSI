import type { InitConfig } from '@credo-ts/core'
import {
  Agent,
  ConsoleLogger,
  LogLevel,
  OutOfBandModule,
  CredentialsModule,
  ProofsModule,
  DidsModule,
  ConnectionsModule,
  HttpOutboundTransport,
  WsOutboundTransport,
  KeyDidResolver,
  PeerDidResolver,
  JwkDidResolver,
  KeyDidRegistrar,
  PeerDidRegistrar,
  V2CredentialProtocol,
  V2ProofProtocol,
  MediatorModule,
} from '@credo-ts/core'
import { agentDependencies, HttpInboundTransport, WsInboundTransport } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { AnonCredsCredentialFormatService, AnonCredsModule, AnonCredsProofFormatService, LegacyIndyCredentialFormatService, V1CredentialProtocol } from '@credo-ts/anoncreds'
import { IndyVdrAnonCredsRegistry, IndyVdrIndyDidRegistrar, IndyVdrIndyDidResolver, IndyVdrModule, IndyVdrSovDidResolver } from '@credo-ts/indy-vdr'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import fs from 'fs'
import path from 'path'
const genesisPath = path.join(__dirname, 'ledgers', 'builder-genesis.txn')
const genesisTransactions = fs.readFileSync(genesisPath, 'utf8')
let agent: Agent | null = null




export async function initializeAgent() {
  if (agent) return agent

  const config: InitConfig = {
    label: 'docs-agent-nodejs',
    logger: new ConsoleLogger(LogLevel.debug),
    endpoints: ['https://f9d6-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app'], // public DIDComm endpoint
    walletConfig: {
      id: 'wallet-id-v2',
      key: 'testkey0000000000000000000000000'
    },
    
    
  }

  agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: 'bcovrin:test',
            genesisTransactions: genesisTransactions,
            connectOnStartup: true,
          },
        ],
      }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry()],
        anoncreds,
      }),
      credentials: new CredentialsModule({
        credentialProtocols: [
          new V1CredentialProtocol({
            indyCredentialFormat: new LegacyIndyCredentialFormatService(),
          }),
          new V2CredentialProtocol({ credentialFormats: [new AnonCredsCredentialFormatService()] }),
        ],

      }),
      connections: new ConnectionsModule({
        autoAcceptConnections: true,
      }),
      dids: new DidsModule({
        resolvers: [new KeyDidResolver(), new PeerDidResolver(), new JwkDidResolver(), new IndyVdrSovDidResolver(), new IndyVdrIndyDidResolver()],
        // Register registrars
        registrars: [new KeyDidRegistrar(), new PeerDidRegistrar(), new IndyVdrIndyDidRegistrar()]
      }),
      proofs: new ProofsModule({
        proofProtocols: [
          new V2ProofProtocol({
            proofFormats: [
              new AnonCredsProofFormatService(), // This is required for AnonCreds proofs
            ]
          })
        ]
      }),
      oob: new OutOfBandModule(),
       mediator: new MediatorModule({
        autoAcceptMediationRequests: true, // <-- Auto-accept requests from wallets
      }),
     
    },
  })

  // Inbound/outbound transports
  agent.registerOutboundTransport(new HttpOutboundTransport())
  agent.registerOutboundTransport(new WsOutboundTransport())
  agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }))
  agent.registerInboundTransport(new WsInboundTransport({ port: 3002 }))

  // Listen for inbound messages
  agent.events.on('InboundMessageReceived', (event: any) => {
    console.log('🔔 Inbound message:', event.type, event.message)
  })
  agent.events.on('TenantAgentContextCreated', (event: any) => {
    console.log('🏢 Tenant agent context created:', event.tenantId)
  })

  agent.events.on('TenantAgentContextDestroyed', (event: any) => {
    console.log('🏢 Tenant agent context destroyed:', event.tenantId)
  })


  await agent.initialize()
  

  console.log('✅ Agent initialized for Indy V1')
  return agent
}



export function getAgent(): Agent {
  if (!agent) throw new Error('Agent not initialized')
  return agent
}
