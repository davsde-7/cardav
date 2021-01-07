const mongoose = require('mongoose');
const BufferBatterySchema = require('./bufferbatteryschema.js');

let prosumerSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    production:{
        type: Number,
        required: true,
        default: 0.0
    },
    consumption:{
        type: Number,
        required: true,
        default: 0.0
    },
    netProduction:{
        type: Number,
        required: true,
        default: 0.0
    },
    marketDemand:{
        type: Number,
        required: true,
        default: 0.0
    },
    blackout:{
        type: Boolean,
        required: true,
        default: false
    },
    blocked:{
        type: Boolean,
        required: true,
        default: false
    },
    netProdToBufRatio: {
        type: Number,
        required: true,
        default: 50
    },
    undProdFromBufRatio: {
        type: Number,
        required: true,
        default: 50
    },
    sellToMarket: {
        type: Number,
        required: true,
        default: 0.0
    },
    buyFromMarket: {
        type: Number,
        required: true,
        default: 0.0
    },
    bufferBatteryCapacity: {
        type: Number,
        required: true,
        default: 120
    },
    lastloggedin:{
        type: Date,
        required: true,
        default: Date.now()
    },
    loggedin:{
        type: Boolean,
        required: true,
        default: 'false'
    }
})

const Prosumers = module.exports = mongoose.model('Prosumers', prosumerSchema);