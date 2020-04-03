const mongoose = require('mongoose');
const genID = require('../utils/genID');

const Schema = mongoose.Schema;
// TODO : make schema camelcase
const GameSchema = new Schema({
  gameover: { type: Boolean, default: false },
  middlecard: { type: Number, min: 1, max: 5 },
  players: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      hand: [{ type: Number, min: 1, max: 5 }],
      collected: [{ type: Number, min: 1, max: 5 }],
      needsUpdate: { type: Boolean, default: true },
      points: { type: Number, default: 0 },
      played: { type: Number, min: 1, max: 5 },
      lastPlayed: { type: Number, min: 1, max: 5 },
    },
  ],
});

GameSchema.virtual('gameID').get(function () {
  return genID(this._id);
});

//NOTE: doesn't save
GameSchema.methods.resetNeedsUpdate = function (next) {
  this.players.forEach((p) => (p.needsUpdate = true));
};

GameSchema.methods.toJSON = function () {
  const obj = this.toObject();
  //HIDES OPPONENETS HAND, WHO NEEDS IT
  obj.players.forEach((p) => {
    //delete p.hand;
    delete p.needsUpdate;
    delete p.played;
  });
  return obj;
};

module.exports = mongoose.model('Game', GameSchema);
