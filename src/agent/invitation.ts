import QRCode from 'qrcode'
import { Attachment, HandshakeProtocol } from '@credo-ts/core'
import { getAgent } from './agent'
import { configDotenv } from 'dotenv'
configDotenv()
// export async function createInvitation(userId:any) {
//   const agent = getAgent()
//   //mediation URL
//    const mediatorOutOfBandRecord = await agent.oob.createInvitation({ 
//     multiUseInvitation: true,
//     label: 'My Mediator for Bifold'
//   })

//   // Get the raw invitation record
//   const invitationRecord = mediatorOutOfBandRecord.outOfBandInvitation
  
//   // ✅ CORRECT: Generate the standard OOB URL (Bifold accepts this)
//   const mediatorInvitationUrl = invitationRecord.toUrl({
//     domain: 'https://357f-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app',
//   })
//   console.log('✅ Mediator Invitation URL (OOB format):', mediatorInvitationUrl)
//   const invitationJson = JSON.stringify(invitationRecord.toJSON())
//   const base64Invitation = Buffer.from(invitationJson).toString('base64')
//   const legacyInvitationUrl = `https://357f-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app?c_i=${base64Invitation}`
//   const oob_mediator_Invitation = `https://357f-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app?00b=${base64Invitation}`
//   console.log('📜 Legacy Invitation URL (c_i format):', legacyInvitationUrl)

//   //mediation URL END

//   // 1️⃣ Create an Out-of-Band invitation
//   const oobRecord = await agent.oob.createInvitation({
//     label: 'Indy V1 Test Invite',
//     handshake: true,
 
//   //   appendedAttachments: [
//   //   new Attachment({
//   //     id: 'qr-metadata',
//   //     mimeType: 'application/json',
//   //     data: {
//   //       json: {
//   //         qrToken: userId
//   //       }
//   //     }
//   //   })
//   // ],
  
//     // autoAcceptConnection: true,
//   })

//   // 2️⃣ Convert invitation to URL
//   const invitationUrl = oobRecord.outOfBandInvitation.toUrl({
//     domain: 'https://357f-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app', // your agent endpoint
//   })

//   console.log('Invitation URL:', invitationUrl)

//   // 3️⃣ Generate QR code as a Data URL
//   const qrCodeDataUrl = await QRCode.toDataURL(invitationUrl)
//   console.log('QR Code Data URL:', qrCodeDataUrl)
//   await QRCode.toString(invitationUrl, { type: 'terminal', small: true }).then(console.log)

//   // Optional: log QR code to terminal (ASCII)


//   return {
//     oobRecord,
//     invitationUrl,
//     qrCodeDataUrl, // can be rendered in frontend <img src={qrCodeDataUrl} />
//     legacyInvitationUrl,
//     oob_mediator_Invitation,
//     base64Invitation
    
//   }
// }


const agentPort = Number(process.env.Agent_Port) || 3001;

export async function createInvitation(userId:any) {
  const agent = getAgent()

  // 1️⃣ Create an Out-of-Band invitation
  const oobRecord = await agent.oob.createInvitation({
    label: 'Indy V1 Test Invite',
    handshake: true,
 
    appendedAttachments: [
    new Attachment({
      id: 'qr-metadata',
      mimeType: 'application/json',
      data: {
        json: {
          qrToken: userId
        }
      }
    })
  ],
  
    // autoAcceptConnection: true,
  })

  // 2️⃣ Convert invitation to URL
  const invitationUrl = oobRecord.outOfBandInvitation.toUrl({
    domain: 'http://159.203.35.6:5018', // your agent endpoint
  })

  console.log('Invitation URL:', invitationUrl)

  // 3️⃣ Generate QR code as a Data URL
  const qrCodeDataUrl = await QRCode.toDataURL(invitationUrl)

  // Optional: log QR code to terminal (ASCII)
  await QRCode.toString(invitationUrl, { type: 'terminal',small: true }).then(console.log)

  return {
    oobRecord,
    invitationUrl,
    qrCodeDataUrl, // can be rendered in frontend <img src={qrCodeDataUrl} />
  }
}




export const create_mediation_url = async () => {
  try {
    const agent = getAgent()
    
    // ✅ Create invitation with mediation protocol (required for Bifold)
    const mediatorOutOfBandRecord = await agent.oob.createInvitation({
      multiUseInvitation: true,
      label: 'My Mediator for Bifold',
      // Use the proper HandshakeProtocol enum
      handshakeProtocols: [HandshakeProtocol.DidExchange], // This is the correct type
      // For messages, we need to create proper AgentMessage instances
    })

    // Get the invitation record
    const invitationRecord = mediatorOutOfBandRecord.outOfBandInvitation
    
    // Generate the URL that Bifold can scan
    const mediatorInvitationUrl = invitationRecord.toUrl({
      domain: "http://159.203.35.6:5018",
    })
    
    console.log('✅ Mediation URL created successfully')
    console.log('URL:', mediatorInvitationUrl)
    
    return mediatorInvitationUrl

  } catch (e: any) {
    throw new Error(`Failed to create mediation URL: ${e.message}`)
  }
}


// export const create_mediation_url = async () => {
//   try {
//     const agent = getAgent()
    
//     // Create the base invitation
//     const mediatorOutOfBandRecord = await agent.oob.createInvitation({
//       multiUseInvitation: true,
//       label: 'My Mediator for Bifold',
//       handshakeProtocols: [HandshakeProtocol.DidExchange],
//     })

//     // Get the invitation record
//     const invitationRecord = mediatorOutOfBandRecord.outOfBandInvitation
    
//     // MANUALLY add mediation protocol to the invitation
//     // This is what Bifold needs to recognize it as a mediator
//     const invitationJson = invitationRecord.toJSON() as Record<string, any>
    
//     // Add mediation protocol to handshake_protocols
//     invitationJson.handshake_protocols.push(
//       'https://didcomm.org/mediator-coordination/1.0'
//     )
    
//     // Add the mediation request as an attachment
//     invitationJson['requests~attach'] = [{
//       '@id': uuidv4(),
//       'mime-type': 'application/json',
//       data: {
//         json: {
//           '@type': 'https://didcomm.org/mediator-coordination/1.0/mediate-request',
//           '@id': uuidv4()
//         }
//       }
//     }]
    
//     // Re-encode the invitation
//     const mediatorInvitationUrl = 
//       `https://f9d6-2a0d-5600-235-5000-5e78-f8bc-3f47-ccdf.ngrok-free.app?oob=${
//         Buffer.from(JSON.stringify(invitationJson)).toString('base64')
//       }`
    
//     console.log('✅ Mediation URL created successfully')
    
//     // Verify it has the mediation protocol
//     const decoded = JSON.parse(
//       Buffer.from(mediatorInvitationUrl.split('oob=')[1], 'base64').toString()
//     )
//     console.log('Handshake protocols:', decoded.handshake_protocols)
//     console.log('Has mediation request:', !!decoded['requests~attach'])
    
//     return mediatorInvitationUrl

//   } catch (e: any) {
//     throw new Error(`Failed to create mediation URL: ${e.message}`)
//   }
// }