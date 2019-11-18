const mongoose = require('mongoose')
const forgotPasswordTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
})
module.exports = mongoose.model('ForgotPasswordToken', forgotPasswordTokenSchema)
