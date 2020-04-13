const mongoose = require('mongoose');
const genID = require('../utils/genID');

const Schema = mongoose.Schema;
// TODO : make schema camelcase
const GameSchema = new Schema({
  gameover: { type: Boolean, default: false },
  middlecard: { type: Number, min: 1, max: 5 },
  battleStart: Date,
  summaryInfo: {
    roundWon: { type: Boolean, default: false },
    reason: { type: String, enum: ['THREE_OF_A_KIND', 'GREATER_THAN_FIVE'] },
    draw: { type: Boolean, default: false },
  },
  players: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      hand: [{ type: Number, min: 1, max: 5 }],
      collected: [{ type: Number, min: 1, max: 5 }],
      points: { type: Number, default: 0 },
      played: { type: Number, min: 1, max: 5 },
      lastPlayed: { type: Number, min: 1, max: 5 },
    },
  ],
});

GameSchema.virtual('gameID').get(function () {
  return genID(this._id);
});

GameSchema.methods.toJSON = function () {
  const obj = this.toObject();
  //HIDES OPPONENETS HAND, WHO NEEDS IT
  obj.players.forEach((p) => {
    //delete p.hand;
    delete p.played;
  });
  return obj;
};

module.exports = mongoose.model('Game', GameSchema);
