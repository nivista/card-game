const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const User = require('./models/user')

const app = express()

const mongoDB =
    'mongodb+srv://dbUser:dbUserPassword@cluster0-uyibg.mongodb.net/local_library?retryWrites=true&w=majority'

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

/*
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connection called open')
});
*/

app.use(cookieParser())
app.use(session({
  store: new MongoStore({ mongooseConnection : mongoose.connection}),
  resave: true,
  saveUninitialized: true,
  secret: 'cookie monster'
}))
app.use(function(req, res, next){
  User.findOne({sessionID: req.sessionID},function(err, doc){
    if(err) next(err)
    if(doc){
      req.user = doc
      next()
    }else{
      new User({sessionID: req.sessionID, nickname: "Jeremy"}).save(function(err, doc){
        req.user = doc
        next()
      })
    }
  })
})

//API, THREE METHODS
//get nickname
app.get('/name', function(req,res){
  res.send(req.user.nickname)
})

// get gamestate
app.get('/game/:gameid', function(req, res, next){
  // did the time pass for everyone to move
    // update the state inluding needsUpdate (true for everyone)
  // is an update needed
    // respond with updated state
  // otherwise respond with nothing

  // along with new game state, also give last rounds results
  // who didn't move in time if any?
  // who won the card
  // did the round end ?
  // did the game end -> game summary


  res.send('NOT IMPLEMENTED: get gamestate ' + req.params.gameid)
})

//post move
app.post('/move', function(req, res, next){
  // maybe check that its a valid move
  // update game state
  res.send('NOT IMPLEMENTED: move')
})

app.listen(3000, () => console.log('Listening port 3000'));
