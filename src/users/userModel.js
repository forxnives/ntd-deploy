const mongoose = require('mongoose');

const { Schema } = mongoose;

//need to add authentication and authorization


const userSchema = new Schema({

    userType: {
        type: String,
        enum: ['EMPLOYEE', 'ADMIN'],
        required: true
    },

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    encryptedPassword: {
        type: String,
        required: true
    },

    displayPicPath: String   //path to display pic file

});



const User = mongoose.model('User', userSchema);

    
module.exports = { userSchema, User };
