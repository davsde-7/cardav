const mongoose = require('mongoose');

let consumerSchema = mongoose.Schema({
    identification:{
        type: Number,
        required: true,
        unique: true
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
})

const Consumer = module.exports = mongoose.model('Consumer', consumerSchema);