const mongoose = require('mongoose');
const nicknames = require('../utils/nicknames');
const botNicknames = require('../utils/botNicknames');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  sessionID: String,
  nickname: String,
  bot: { type: Boolean, default: false },
});

UserSchema.methods.setNickname = function () {
  const nicknameList = this.bot ? botNicknames : nicknames;
  this.nickname = nicknameList[Math.floor(Math.random() * nicknameList.length)];
};

module.exports = mongoose.model('User', UserSchema);
