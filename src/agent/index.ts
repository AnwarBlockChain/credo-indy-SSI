// import type { InitConfig } from '@credo-ts/core'
// import { Agent, ConsoleLogger, LogLevel, OutOfBandModule } from '@credo-ts/core'
// import { agentDependencies } from '@credo-ts/node'
// import { HttpOutboundTransport, WsOutboundTransport } from '@credo-ts/core'
// import { HttpInboundTransport } from '@credo-ts/node'
// import { AskarModule } from '@credo-ts/askar'
// import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
// import { anoncreds } from '@hyperledger/anoncreds-nodejs'
// import { AnonCredsModule } from '@credo-ts/anoncreds'
// import { IndyVdrAnonCredsRegistry } from '@credo-ts/indy-vdr'
// import { DidsModule, ConnectionsModule } from '@credo-ts/core'
// import QRCode from 'qrcode'

// const config: InitConfig = {
//   label: 'docs-agent-nodejs',
//   logger: new ConsoleLogger(LogLevel.debug),
//   endpoints: ["https://f30fde967bea.ngrok-free.app"],
//   walletConfig: {
//     id: 'wallet-id',
//     key: 'plokijuhygtfrdescvbnmza123456789',
//   },
// }

// const agent = new Agent({
//   config,
//   dependencies: agentDependencies,
//   modules: {
//     askar: new AskarModule({
//       ariesAskar,
//     }),
//     anoncreds: new AnonCredsModule({
//       // Here we add an Indy VDR registry as an example, any AnonCreds registry
//       // can be used
//       registries: [new IndyVdrAnonCredsRegistry()],
//       //@ts-ignore
//       anoncreds,
//     }),
//     dids: new DidsModule({ resolvers: [] }),
//     connections: new ConnectionsModule(),
//     oob: new OutOfBandModule(),
//   },


// })
// agent.registerOutboundTransport(new HttpOutboundTransport())
// agent.registerOutboundTransport(new WsOutboundTransport())
// agent.registerInboundTransport(new HttpInboundTransport({ port: 3000 }))
// agent
//   .initialize()
//   .then(async() => {
//     console.log('Agent initialized!',agent)
//     console.log(`creating an invitation now for the user`);
//     const invitation = await agent.oob.createInvitation({
//       label: 'Docs Agent',
//       goal: 'Connect wallet',
//       goalCode: 'ssi-auth',
//     })
//     //
//     //in between these lines we try to get the version of this invitation that is qr code
//     const invitationUrl = invitation.outOfBandInvitation.toUrl({domain:"https://09fdc909a23c.ngrok-free.app"})
//     console.log(`the invitation url is this : ${invitationUrl}`)
//       //+++++++++++++++++++++++++
//       const qrDataUrl = await QRCode.toDataURL(invitationUrl)
//       console.log('QR Code Data URL:', qrDataUrl)
//       QRCode.toString(invitationUrl, { type: "terminal",small: true }, (err, qr) => {
//   if (err) {
//     console.error("Error generating QR:", err);
//     return;
//   }
//   console.log(qr);
// });
//     //
//     console.log(`the invitation is this one ${invitation} with out json`)
//      console.log(`with  json ${JSON.stringify(invitation,null,2)}`)
//   })
//   .catch((e) => {
//     console.error(`Something went wrong while setting up the agent! Message: ${e}`)
//   })


