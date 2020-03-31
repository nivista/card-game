const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayerSchema = new Schema({
  user: Schema.Types.ObjectId,
  handIds :[ Number ],
  collectionIds:[ Number ],
  needsUpdate: Boolean,
  points: Number
})

PlayerSchema.virtual('hand').get(function(){

})

PlayerSchema.virtual('collection').get(function(){

})




module.exports = mongoose.model('Player', PlayerSchema)
