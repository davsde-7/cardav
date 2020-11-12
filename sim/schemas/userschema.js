const mongoose = require('mongoose');

// Schema for users
let userSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default: 'consumer'
    },
    image:{
        type: String,
        required: true,
        default: 'URL PATH TO DEFAULT PICTURE'
    },
    creationDate:{
        type: Date,
        default: Date.now()
    },
    lastLoggedIn:{
        type: Date
    }
})

module.exports = mongoose.model('user', userSchema);