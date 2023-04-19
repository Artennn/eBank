import mongoose from 'mongoose';
const { Schema } = mongoose;

import { accountSchema } from './account.js';

const userSchema = new Schema({
    login: { type: String, required: true, unique: true, minLength: 3 },
    password: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true },
    image: String,
    account: { type: accountSchema, required: true },
});

const userModel = mongoose.model('user', userSchema);
export default userModel;

/* const users = [
    {
        login: 'react',
        password: 'react',
        email: 'student@student.com',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/240px-React-icon.svg.png',
        account: {
            number: '12 1580 0000 0000 0000 0000 0000'.replaceAll(' ', ''),
            name: "React",
            address: "ul. Warszawska 11, Warszawa",
            postal: "10-100 Warszawa",
        },
    },
    { 
        login: 'angular',
        password: 'angular',
        email: 'angular@angular.com',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/800px-Angular_full_color_logo.svg.png',
        account: {
            number: '12 1580 0000 0000 0000 0000 1111'.replaceAll(' ', ''),
            name: "Angular",
            address: "ul. Warszawska 12, Warszawa",
            postal: "10-100 Warszawa",
        },
    },
]
userModel.insertMany(users); */