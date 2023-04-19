import mongoose from 'mongoose';
import { accountSchema } from './account.js';
const { Schema } = mongoose;

export const transferInfoSchema = new Schema({
    title: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['0', '1'], required: true },
}, {
    _id: false,
})

export const transferSchema = new Schema({
    sourceAccount: { type: accountSchema, required: true },
    targetAccount: { type: accountSchema, required: true },
    transferInfo: { type: transferInfoSchema, required: true },
});