let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let detailSchema = Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _menu: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    food: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

let orderRecordsSchema = Schema({
    _menu: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        // required: true
    },
    food: [detailSchema],
    order: [{}]
}, { timestamps: true });

let OrderRecord = module.exports = mongoose.model('Order', orderRecordsSchema);