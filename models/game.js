const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GameSchema = new Schema({
  gameID: String,
  players: [{type: Schema.Types.ObjectId, ref='Player'}]
})

module.exports = mongoose.model('Game', GameSchema)
