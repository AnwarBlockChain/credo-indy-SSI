"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitation = createInvitation;
const qrcode_1 = __importDefault(require("qrcode"));
const agent_1 = require("./agent");
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
async function createInvitation(userId) {
    const agent = (0, agent_1.getAgent)();
    // ✅ CORRECT: Create mediator invitation (OOB format)
    const mediatorOutOfBandRecord = await agent.oob.createInvitation({
        multiUseInvitation: true,
        label: 'My Mediator for Bifold'
    });
    // Get the raw invitation record
    const invitationRecord = mediatorOutOfBandRecord.outOfBandInvitation;
    // ✅ CORRECT: Generate the standard OOB URL (Bifold accepts this)
    const mediatorInvitationUrl = invitationRecord.toUrl({
        domain: agentPort.toString(),
    });
    console.log('✅ MEDIATOR URL FOR BIFOLD:', mediatorInvitationUrl);
    // Optional: Create legacy format if needed
    const invitationJson = JSON.stringify(invitationRecord.toJSON());
    const base64Invitation = Buffer.from(invitationJson).toString('base64');
    const legacyInvitationUrl = `agentPort?c_i=${base64Invitation}`;
    // ❌ REMOVE THIS LINE - it's incorrect
    // const oob_mediator_Invitation = `https://...?00b=${base64Invitation}`
    // Your existing OOB invitation for BC Wallet
    const oobRecord = await agent.oob.createInvitation({
        label: 'Indy V1 Test Invite',
        handshake: true,
    });
    const invitationUrl = oobRecord.outOfBandInvitation.toUrl({
        domain: 'agentPort',
    });
    // Generate QR code
    const qrCodeDataUrl = await qrcode_1.default.toDataURL(invitationUrl);
    await qrcode_1.default.toString(invitationUrl, { type: 'terminal', small: true }).then(console.log);
    return {
        oobRecord,
        invitationUrl,
        qrCodeDataUrl,
        mediatorInvitationUrl, // ✅ USE THIS ONE for Bifold
        legacyInvitationUrl, // ✅ Only if needed
        // ❌ REMOVE oob_mediator_Invitation from return
        // base64Invitation     // ❌ Not needed
    };
}
//# sourceMappingURL=invitation.js.map