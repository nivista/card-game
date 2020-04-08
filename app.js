const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');
//const async = require('async') TODO:: REMOVE DEPENDENCY
// models
const User = require('./models/user');
const game = require('./game');

const app = express();

// TODO: setup a new database
const mongoDB =
  'mongodb+srv://dbUser:dbUserPassword@cluster0-uyibg.mongodb.net/local_library?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3001'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true,
    secret: 'cookie monster',
    cookie: {
      httpOnly: false, //ALLOW COOKIE TO BE VISIBLE FROM JAVASCRIPT
    },
  })
);
app.use(function (req, res, next) {
  User.findOne({ sessionID: req.sessionID }, function (err, doc) {
    if (err) next(err);
    if (doc) {
      req.user = doc;
      next();
    } else {
      const user = new User({ sessionID: req.sessionID });
      user.setNickname();
      user.save();
      req.user = user;
      next();
    }
  });
});

app.get('/name', function (req, res) {
  res.send(req.user.nickname);
});

app.post('/game/new', game.new);

app.post('/game/join', game.join);

app.post('game/leave/', game.leave);

app.post('/game/start', game.start);

// get gamestate
app.get('/game/:gameid', game.get);

//post move
app.post('/game/move', game.move);

app.listen(3000, () => console.log('Listening port 3000'));
