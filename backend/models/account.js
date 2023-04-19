import mongoose from 'mongoose';
const { Schema } = mongoose;

export const accountSchema = new Schema({
    number: { type: String, required: true, minLength: 26, maxlength: 26 },
    name: { type: String, required: true },
    name2: String,
    address: { type: String, required: true },
    postal: { type: String, required: true},
}, {
    _id: false,
});