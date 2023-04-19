import mongoose from 'mongoose';
import { accountSchema } from './account.js';
import { transferInfoSchema } from './transfer.js';
const { Schema } = mongoose;

const operationSchema = new Schema({
    sourceAccount: { type: accountSchema, required: true },
    targetAccount: { type: accountSchema, required: true },
    transferInfo: { type: transferInfoSchema, required: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});

export const operationModel = mongoose.model('operation', operationSchema);