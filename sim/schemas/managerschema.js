const mongoose = require('mongoose');

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
    powerPlantStatusChangedDate:{
        type: Date,
        required: true,
        default: Date.now()
    },
    electricityPrice:{
        type: Number,
        required: true,
        default: 154
    },
    marketRatio:{
        type: Number,
        required: true,
        default: 0.5
    },
    bufferRatio:{
        type: Number,
        required: true,
        default: 0.5
    },

    bufferBatteryCapacity: {
        type: Number,
        required: true,
        default: 3700.0
    }
})

const Managers = module.exports = mongoose.model('Managers', managerSchema);