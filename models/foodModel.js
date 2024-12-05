let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let foodSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
}, { timestamps: true });

let Food = module.exports = mongoose.model('Food', foodSchema);