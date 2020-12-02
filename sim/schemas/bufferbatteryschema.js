const mongoose = require('mongoose');

let bufferBatterySchema = mongoose.Schema({
    currentCapacity:{
        type: Number,
        required: true,
        default: 100.0
    },
    maxCapacity:{
        type: Number,
        requred: true,
        default: 150.0
    },
    minCapacity:{
        type: Number,
        requred: true,
        default: 0.0
    },
    owner:{
        type: String,
        requred: true,
        unique: true
    }
})

const BufferBatterySchema = module.exports = mongoose.model('BufferBatterySchema', bufferBatterySchema);