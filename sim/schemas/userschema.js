const mongoose = require('mongoose');

// Schema for users
let userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default: 'prosumer'
    },
    image:{
        type: String,
        required: true,
        default: 'URL PATH TO DEFAULT PICTURE'
    },
    creationdate:{
        type: Date,
        default: Date.now()
    },
    lastloggedin:{
        type: Date
    }
})

const User = module.exports = mongoose.model('User', userSchema);