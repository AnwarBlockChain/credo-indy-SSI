import { getAgent } from './agent.js'
import { ConnectionEventTypes } from '@credo-ts/core'
import ConnectedWallet from '../schems/wallet.js' // <-- use your mongoose model

const connectedWallets: Record<string, any> = {}

export function registerConnectionListeners() {
  const agent = getAgent()

  agent.events.on(ConnectionEventTypes.ConnectionStateChanged, async (event:any) => {
    const { connectionRecord } = event.payload

    console.log('🔗 Connection state:', connectionRecord.state)

    // ✅ USE THE INSTANCE
    if (connectionRecord.state === 'request-received') {
      console.log('➡️ Connection request received! Accepting..............')
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
      console.log(`a`)
         await ConnectedWallet.findOneAndUpdate(
        { connectionId: connectionRecord.id },
        {
          connectionId: connectionRecord.id,
          publicKey: connectionRecord.theirDid,
          label: connectionRecord.theirLabel,
          state: connectionRecord.state,
          connectedAt: new Date(),
        },
        { upsert: true, new: true }
      )
      await agent.connections.acceptRequest(connectionRecord.id)
    }

    if (connectionRecord.state === 'completed') {
      console.log('✅ Wallet connected:', connectionRecord.theirDid)
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
      console.log(`the qr token found in meta data `)
      connectedWallets[connectionRecord.id] = connectionRecord
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
        console.log('💾 Connection saved to DB:', connectionRecord.theirDid)
    }
  })
}

export function getConnectedWallets() {
  return connectedWallets
}
