let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
    },
    cutOff: {
        type: Date,
    },
    name: {
        type: String,
    },
    office: {
        type: String,
    },
    mealType: {
        type: String,
    },
    menuTitle: {
        type: String,
    },
    order: [{}]
}, { timestamps: true });

let Order = module.exports = mongoose.model('Order', orderSchema);