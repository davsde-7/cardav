const mongoose = require('mongoose');

let consumerSchema = mongoose.Schema({
    id:{
        type: ObjectId,
        required: true,
        unique: true
    },

    consumption:{
        type: double,
        required: true,
        default: 0.0
    },
})

const Consumer = module.exports = mongoose.model('Consumer', consumerSchema);