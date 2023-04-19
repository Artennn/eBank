import mongoose from 'mongoose';
import { accountSchema } from './account.js';
import { transferInfoSchema } from './transfer.js';
const { Schema } = mongoose;

const definedTransferSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    targetAccount: { type: accountSchema, required: true },
    transferInfo: { type: transferInfoSchema, required: true },
});

export default mongoose.model("definedTransfer", definedTransferSchema);