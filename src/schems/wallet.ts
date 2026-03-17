// import mongoose from 'mongoose'

// const ConnectedWalletSchema = new mongoose.Schema({
//   connectionId: { type: String, required: true, unique: true },
//   publicKey: { type: String, required: true, unique: true }, // theirDid
//   label: { type: String },
//   state: { type: String },
//   createdAt: { type: Date, default: Date.now },
// })

// export default mongoose.model('ConnectedWallet', ConnectedWalletSchema)
import mongoose from 'mongoose'

const ConnectedWalletSchema = new mongoose.Schema({
  connectionId: { type: String, required: true, unique: true }, // wallet connection ID
  publicKey: { type: String, required: true, unique: true },   // theirDid
  label: { type: String },
  state: { type: String, enum: ['request-received', 'completed'], default: 'request-received' },
  createdAt: { type: Date, default: Date.now },
  connectedAt: { type: Date },  // timestamp when wallet connected
})

export default mongoose.model('ConnectedWallet', ConnectedWalletSchema)

