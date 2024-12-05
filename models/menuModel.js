let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let menuSchema = mongoose.Schema({
    menuTitle: {
        type: String
    },
    description: {
        type: String
    },
    menu: [{
        name: [{
            orders: [{
                _order :{
                    type: Schema.Types.ObjectId,
                    ref: 'Order'
                },
                mealTime : {
                    type: String
                },
                office : {
                    type: String
                },
                name : {
                    type: String
                }
            }],
            name: {
                type: String
            }
        }],
        date: {
            type: Date
        },
        holiday: {
            type: Boolean,
            default: false,
        }
    }],
    cutOff: {
        type: Date,
        required: true
    },
    mealTime: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

let Menu = module.exports = mongoose.model('Menu', menuSchema);