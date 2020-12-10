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
        default: 0.5
    },

    undProdFromBufRatio: {
        type: Number,
        required: true,
        default: 0.5
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
    }
})

const Prosumers = module.exports = mongoose.model('Prosumers', prosumerSchema);