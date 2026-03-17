"use strict";
// import mongoose from 'mongoose'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const ConnectedWalletSchema = new mongoose.Schema({
//   connectionId: { type: String, required: true, unique: true },
//   publicKey: { type: String, required: true, unique: true }, // theirDid
//   label: { type: String },
//   state: { type: String },
//   createdAt: { type: Date, default: Date.now },
// })
// export default mongoose.model('ConnectedWallet', ConnectedWalletSchema)
const mongoose_1 = __importDefault(require("mongoose"));
const ConnectedWalletSchema = new mongoose_1.default.Schema({
    connectionId: { type: String, required: true, unique: true }, // wallet connection ID
    publicKey: { type: String, required: true, unique: true }, // theirDid
    label: { type: String },
    state: { type: String, enum: ['request-received', 'completed'], default: 'request-received' },
    createdAt: { type: Date, default: Date.now },
    connectedAt: { type: Date }, // timestamp when wallet connected
});
exports.default = mongoose_1.default.model('ConnectedWallet', ConnectedWalletSchema);
//# sourceMappingURL=wallet.js.map