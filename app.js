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
const Game = require('./models/game');
const CARDS = require('./utils/cards');

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

/*
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connection called open')
});
*/

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3001'],
  credentials: true,
};

app.use(cors(corsOptions)); //TODO: be more restrictive/ should i be putting headers here, not below
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true,
    secret: 'cookie monster',
    cookie: {
      httpOnly: false,
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

//API, FOUR METHODS
// might add
// leave game
// join game
// start game

//also need
//current user id
//everyone's nicknames

//get nickname
app.get('/name', function (req, res) {
  res.send(req.user.nickname);
});

app.post('/game/new', function (req, res, next) {
  // create new game
  // host will just be the first player in the players list
  // remember to end game if the host leaves
  const game = new Game();
  game.players.push({ user: req.user._id });
  game.save();
  res.send(game._id);
});

app.post('/game/join', async function (req, res, next) {
  // ask to join the game
  // returns simple yes or no, and updates state
  // check: is there enough space ?
  // check: are you already playing this game ?
  // NOTE: what about if you closed the tab or something, but you're already in the game

  const gameID = req.body;
  const game = await Game.findById(gameID);
  if (!game) {
    // couldn't find game or game has started
    res.status(400).send("Couldn't find this game");
  } else if (game.middlecard) {
    res.status(400).send('Game has started');
  } else {
    const players = game.players;
    if (players.map((p) => p.user).includes(req.user._id)) {
      //important, this person is already playing
      res.status(204).send("You're already playing this game");
    } else if (players.length > 5) {
      res.status(400).send('Lobby is full');
    } else {
      game.players.push({ user: req.user._id });

      game.save();
      res.send('Good to go, make the next request');
    }
  }
});
app.post('game/leave/:id', function (req, res, next) {
  // has the game not started? just remove them
  // has it started? somehow have to replace with bot
});

app.post('/game/start', async function (req, res, next) {
  // are there enough people
  // in the future maybe we do a ready up feature that can also be checked
  // change the state to start the game, ie maybe just place a middlecard
  // TODO: check that the game hasn't already started
  const game = await Game.findById(req.body);

  if (!game) {
    res.status(400).send("Can't find that game!");
  } else if (game.players.length < 2) {
    res.status(400).send('Not enough players!');
  } else if (!game.players[0].user._id.equals(req.user._id)) {
    res.status(400).send("You're not the host");
  } else {
    game.players.forEach((player) => {
      for (let card = 1; card <= 5; card++) {
        player.hand.push(card);
      }
    });
    game.middlecard = Math.floor(Math.random() * 5 + 1);

    game.save();
    res.send({ status: 'starting' });
  }
});

// get gamestate
app.get('/game/:gameid', async function (req, res, next) {
  let game;
  try {
    game = await Game.findById(req.params.gameid);
  } catch (e) {
    game = null;
  }

  // TODO: this query is a good opportunity to test querying subdocs
  if (!game) {
    res.status(400).send('Invalid Game ID');
    return;
  }

  const populatePlayer = (i) => game.populate(`players.${i}.user`).execPopulate();
  await Promise.all(game.players.map((p, i) => populatePlayer(i)));

  const player = await game.players.find((p) => p.user.equals(req.user._id));
  if (player) {
    res.send({ game, playerID: player._id });
  } else {
    //TODO MAYBE ALLOW SPECTATORS
    res.status(400).send("You're not playing!");
  }
});

//post move
app.post('/game/move', async function (req, res, next) {
  //is it a valid move ?
  // - played is falsy
  // - you have that number in your hand
  //execute move
  // - do it
  const { gameID } = req.body;
  const card = parseInt(req.body.card, 10); //TECHNICALLY COULD NOT USE 10
  const game = await Game.findById(gameID);
  if (!game) {
    res.status(400).send('Game not found!');
    return;
  }
  const player = game.players.find((p) => p.user._id.equals(req.user._id));
  if (!player) {
    res.status(400).send("You're not playing this game!");
    return;
  }
  const hasCard = player.hand.some((c) => c === card);
  if (!hasCard) {
    res.status(400).send("You don't have that card");
    return;
  }

  if (!game.middlecard) {
    res.status(400).send("The game hasn't started");
    return;
  }

  player.played = card;
  //did everyone play ? lets advance then
  if (game.players.every((p) => p.played)) {
    game.players.forEach((p) => (p.lastPlayed = p.played));
    const temp = game.players.map((p, i) => {
      return { card: p.played, idx: i };
    });
    //GAME LOGIC

    //REMOVE DUPLICATES
    temp.sort((p1, p2) => p1.card - p2.card);

    for (let i = temp.length - 1; i >= 1; ) {
      let count = 1;
      while (i > 0 && temp[i--].card === temp[i].card) {
        count++;
      }
      temp.splice(i + 1, count === 1 ? 0 : count);
    }
    let winnerIdx;
    //IF THERE's A FIVE AND A ONE, ONE WINS
    if (temp[0].card === 1 && temp[temp.length - 1].card === 5) {
      winnerIdx = temp[0].idx;
    }
    //OTHERWISE LARGEST NUMBER WINS
    else {
      winnerIdx = temp[temp.length - 1].idx;
    }
    if (winnerIdx !== undefined) {
      let winner = game.players[winnerIdx];
      winner.collected.push(game.middlecard, winner.played);
      playedCardIdx = winner.hand.indexOf(winner.played);
      winner.hand = winner.hand
        .slice(0, playedCardIdx)
        .concat(player.hand.slice(playedCardIdx + 1));

      let won = false;
      //CHECK IF THE ROUND IS WON BY DIAMONDS
      let diamonds = winner.collected.reduce((acc, curr) => {
        return acc + CARDS[curr].diamonds;
      }, 0);
      won = diamonds >= 5;
      //CHECK IF THE ROUND IS ONE BY THREE OF A KIND
      winner.collected.sort();
      for (let i = 0; i < winner.collected.length - 2; i++) {
        won = won || winner.collected[i] === winner.collected[i + 2];
      }
      if (won) {
        winner.points++;
        game.players.forEach((p) => {
          p.collected = [];
          p.hand = [1, 2, 3, 4, 5];
        });
      }
      if (winner.points > 5) {
        //CHANGE TO POINTS_TO_WIN[players.length] or something
        game.gameover = true;
      }
    }

    game.middlecard = Math.floor(Math.random() * 5 + 1); //REFACTOR
    game.players.forEach((p) => (p.played = null));
  }
  await game.save();
  res.send('You played ' + card);
});

app.listen(3000, () => console.log('Listening port 3000'));
