let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let menuOrderSchema = mongoose.Schema({
    _menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    },
    _orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, { timestamps: true });

let MenuOrder = module.exports = mongoose.model('MenuOrder', menuOrderSchema);