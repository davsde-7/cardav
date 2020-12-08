const mongoose = require('mongoose');

let marketSchema = mongoose.Schema({
    manager:{
        type: String,
        required: true,
        unique: true
    },
    marketPrice:{
        type: Number,
        required: true,
        default: 154
    },
    availableCapacity:{
        type: Number,
        required: true,
        default: 0
    },
    marketDemand:{
        type: Number,
        required: true,
        default: 0
    },
})

const Markets = module.exports = mongoose.model('Markets', marketSchema);