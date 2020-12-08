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

    // bufferBattery:{
    //     type: BufferBatterySchema,
    //     required: true
    // },
})

const Prosumers = module.exports = mongoose.model('Prosumers', prosumerSchema);