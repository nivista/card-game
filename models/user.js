const mongoose = require('mongoose')
const nicknames = require('../utils/nicknames')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  sessionID: String,
  nickname: String,
  bot: {type: Boolean, default: false}
})

UserSchema.methods.setNickname = function(){
  this.nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
}

module.exports = mongoose.model('User', UserSchema)
