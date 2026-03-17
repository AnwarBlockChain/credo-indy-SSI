import express from 'express'
import cors from 'cors'

import { getAgent, initializeAgent } from './agent/agent.ts'
import { createInvitation } from './agent/invitation.ts'
import {
  registerConnectionListeners,
  getConnectedWallets,
} from './agent/connected_Wallets.ts'
import { connect } from './utils/connect_data_base.ts'
import { getOrCreateIssuerDid } from './agent/get_Did.ts'
import { registerCredentialEventHandlers } from './agent/connection_Events.ts'
import { registerEmployeeSchema } from './agent/register_Schema.ts'
import { importBCovrinDID } from './agent/import_Bcovrin_Did.ts'
import { registerCredentialDefinition } from './agent/publish_Schema.ts'
import { issueCredentialToBCWallet } from './agent/issue_Credentials.ts'
import { setupWorkingProofListener } from './agent/proof_Events.ts'
import { requestSimpleAttributeProof } from './agent/request_Proof.ts'
import { createTenantWalletAndConnect } from './agent/create_Tenant_Wallet.ts'
import { startDynamicTenantListener } from './agent/tenant_Event_Listener.ts'

export const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

/**
 * 🔒 Routes are registered IMMEDIATELY
 */
app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello from credo agent" })
})

app.get('/invite', async (request, res) => {
  try {
    const {userId} = request.body;
    const invitation = await createInvitation(userId)
    res.json(invitation)
  } catch (e) {
    res.status(503).json({
      error: 'Agent not ready',
    })
  }
})

app.get('/wallets', (_req, res) => {
  res.json(getConnectedWallets())
})

app.get('/did', async (req, res) => {
  // const did = await getOrCreateIssuerDid()
  const did = await importBCovrinDID()
  return res.status(200).json({ did })
})




app.post('/send-message', async (req, res) => {
  try {
    const { connectionId, message } = req.body

    if (!connectionId || !message) {
      return res.status(400).json({ error: 'connectionId and message are required' })
    }

    const agent = getAgent()
    await agent.basicMessages.sendMessage(
      connectionId,
      message
    )

    return res.json({ message: 'Message sent successfully' })
  } catch (err: any) {
    console.error('Error sending message:', err)
    return res.status(500).json({ error: err.message })
  }
})


app.post('/register-schema', async (req, res) => {
  try {
    // const schema = await registerSchema()
    const { schemaName, attributes } = req.body;
    const schema = await registerEmployeeSchema(schemaName, attributes)
    return res.status(200).json({ schema })
  } catch (err) {
    console.error('Error registering schema:', err)
    return res.status(500).json({ error: 'Failed to register schema' })
  }

})

app.post('/schem-definition', async (req, res) => {
  try {
    const { schemaId } = req.body;
    const definition = await registerCredentialDefinition(schemaId)
    return res.status(200).json({ definition })

  } catch (e: any) {
    console.error('Error registering schema:', e)
    return res.status(500).json({ error: 'Failed to register schema', message: e.message })
  }
})


app.post('/issue-credentials', async (req, res) => {
  try {
    const { tenantId,connectionId,athlete_id,nationality,gender } = req.body;
    const issuing = await issueCredentialToBCWallet(tenantId,connectionId,athlete_id,nationality,gender)
    return res.status(200).json({ issuing })
  } catch (e: any) {
    console.error('Error issuing schema:', e)
    return res.status(500).json({ error: 'Failed to issue schema', message: e.message })
  }
})

app.post('/request-proof', async (req, res) => {
  try {
    const {connectionId} = req.body;
    const request = await requestSimpleAttributeProof(connectionId)
    return res.status(200).json({ request })

  } catch (e: any) {
    console.error('Error issuing schema:', e)
    return res.status(500).json({ error: 'Failed to issue schema', message: e.message })
  }
})

//creating a tenant wallet 
app.post('/create-tenant-wallet', async (req, res) => {
  try {
    const { userId } = req.body;
    // Logic to create tenant wallet goes here
    // For demonstration, we'll just return a success message
    const tenant = await createTenantWalletAndConnect(userId)
    return res.status(200).json({ message: `Tenant wallet for ${userId} created successfully`, tenant });
  } catch (e: any) {
    console.error('Error creating tenant wallet:', e);
    return res.status(500).json({ error: 'Failed to create tenant wallet', message: e.message });
  }
});


//1





//2




//3


// app.get('/', (_req, res) => {
//   res.send('SSI Agent running')
// })

/**
 *
 */
app.listen(PORT, async () => {
  await connect();
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})

  /**
   * 🧠 Agent bootstraps independently
   */
  ; (async () => {
    try {
      await initializeAgent()
      registerConnectionListeners()
      await registerCredentialEventHandlers()
      setupWorkingProofListener()
      startDynamicTenantListener()
    } catch (e) {
      console.error('❌ Agent failed to initialize', e)
    }
  })()


