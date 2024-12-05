const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  userType: {
    type: String,
    enum: ['Admin', 'Vendor', 'Employee']
    // required: true
  },
  fullName: {
    type: String,
    default: ''
  },
  givenName: {
    type: String
  },
  familyName: {
    type: String
  },
  imageUrl: {
    type: String
  },
  email: {
    type: String,
    require: true
  },
  department: {
    type: String
  },
  office: {
    type: String
  },
  _orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]

}, { timestamps: true })

const User = module.exports = mongoose.model('User', userSchema)
