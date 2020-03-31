const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  sessionID: String,
  nickname: String
})

module.exports = mongoose.model('User', UserSchema)
