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
        requred: true,
        default: 0.0
    },

    consumption:{
        type: Number,
        requred: true,
        default: 0.0
    },

    netProduction:{
        type: Number,
        requred: true,
        default: 0.0
    },

    marketDemand:{
        type: Number,
        requred: true,
        default: 0.0
    },

    // bufferBattery:{
    //     type: BufferBatterySchema,
    //     requred: true
    // },
})

const Prosumers = module.exports = mongoose.model('Prosumers', prosumerSchema);