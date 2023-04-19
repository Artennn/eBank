import mongoose from 'mongoose';
import { accountSchema } from './account.js';
const { Schema } = mongoose;

const recipientSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'recipientGroup', required: true },
    name: { type: String, required: true },
    account: { type: accountSchema, required: true },
    lastModify: { type: String, required: true },
    trusted: Boolean,
    whitelist: Boolean,
}, {
    timestamps: {
        createdAt: false,
        updatedAt: true,
    },
});

const recipientGroupSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
})

export const recipientModel = mongoose.model('recipient', recipientSchema);
export const recipientGroupModel = mongoose.model('recipientGroup', recipientGroupSchema);