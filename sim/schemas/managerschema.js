const mongoose = require('mongoose');
const BufferBatterySchema = require('./bufferbatteryschema.js');

let managerSchema = mongoose.Schema({
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
    powerPlantStatus:{
        type: String,
        required: true,
        default: "Running"
    },
    electricityPrice:{
        type: Number,
        required: true,
        default: 154
    },
    marketRatio:{
        type: Number,
        required: true,
        default: 50
    },
    bufferRatio:{
        type: Number,
        required: true,
        default: 50
    }
    // bufferBattery:{
    //     type: BufferBatterySchema,
    //     required: true
    // },
})

const Managers = module.exports = mongoose.model('Managers', managerSchema);