const moment = require('moment');

const Game = require('./models/game');
const User = require('./models/user');
const CARDS = require('./utils/cards');

const botsHavePlayed = { data: false };
exports.get = async (req, res) => {
  let game;
  try {
    game = await Game.findById(req.params.gameid);
  } catch (e) {
    console.log('exports.get');
    console.log(e);
  }

  if (!game) {
    return res.status(400).send('Invalid Game ID');
  }

  await populateUsers(game);

  const player = game.players.find((p) => p.user.equals(req.user._id));
  if (!player) {
    return res.status(400).send("You're not playing!");
  }
  if (game.middlecard && !game.gameover && !botsHavePlayed.data) {
    // battle has started
    const timeElapsed = moment().diff(moment(game.battleStart), 'seconds');
    const timeLeft = 10 - timeElapsed;
    if (timeLeft < 0 && !game.players.every((p) => p.played)) {
      //bots move
      game.players
        .filter((p) => !p.played)
        .forEach((p) => (p.played = p.hand[Math.floor(Math.random() * p.hand.length)]));

      performMove(game);

      botsHavePlayed.data = true;
      await game.save(() => {
        botsHavePlayed.data = false; // why does this need to be in callback, not working like i'd expect
      });
    }
  }

  res.send({ game, player });
};

exports.new = async (req, res) => {
  const game = await new Game();
  game.players.push({ user: req.user._id });
  game.save();
  res.send(game._id);
};

exports.start = async (req, res) => {
  const game = await Game.findById(req.body);

  if (!game) {
    return res.status(400).send("Can't find that game!");
  }
  if (game.players.length < 2) {
    return res.status(400).send('Not enough players!');
  }
  if (!game.players[0].user._id.equals(req.user._id)) {
    return res.status(400).send("You're not the host");
  }

  startRound(game);
  startBattle(game);
  game.save();
  res.send({ status: 'starting' });
};

exports.join = async (req, res) => {
  const gameID = req.body;
  let game;
  if (gameID) {
    try {
      game = await Game.findById(gameID);
    } catch (e) {
      console.log('exports.join');
      console.log(e);
    }
  }

  if (!game) {
    return res.status(400).send("Couldn't find this game");
  }
  if (game.middlecard) {
    return res.status(400).send('Game has started');
  }

  const players = game.players;
  if (players.map((p) => p.user).includes(req.user._id)) {
    return res.status(204).send("You're already playing this game");
  }
  if (players.length > 5) {
    return res.status(400).send('Lobby is full');
  }

  game.players.push({ user: req.user._id });

  game.save();
  res.send();
};

exports.leave = async (req, res) => {
  const gameID = req.body;
  let game;
  try {
    game = await Game.findById(gameID);
  } catch (e) {
    console.log('exports.leave');
    console.log(e);
  }
  if (!game) {
    return res.status(400).send('Game not found!');
  }

  const playerIdx = game.players.findIndex((p) => p.user.equals(req.user._id));
  if (playerIdx === -1) {
    return res.status(400).send("You're not in this game!");
  }

  if (game.middlecard) {
    //game has started, lets replace you with a bot by removing your user
    game.players[playerIdx].user = await new User({ nickname: 'Bot', bot: true });
    game.players[playerIdx].user.save();
  } else {
    //lets just remove you from the game
    game.players = game.players.slice(0, playerIdx).concat(game.players.slice(playerIdx + 1));
  }
  game.save();
  res.send();
};

exports.move = async (req, res) => {
  const { gameID } = req.body;
  const card = parseInt(req.body.card, 10); //TECHNICALLY COULD NOT USE 10
  const game = await Game.findById(gameID);
  if (!game) {
    return res.status(400).send('Game not found!');
  }
  const player = game.players.find((p) => p.user._id.equals(req.user._id));
  if (!player) {
    return res.status(400).send("You're not playing this game!");
  }

  if (!player.hand.includes(card)) {
    return res.status(400).send("You don't have that card");
  }

  if (!game.middlecard) {
    return res.status(400).send("The game hasn't started");
  }

  await populateUsers(game);

  //update state
  player.played = card;
  //did everyone play ? lets advance then
  if (game.players.every((p) => p.played)) {
    performMove(game);
  }
  game.save();
  res.send('You played ' + card);
};

const performMove = (game) => {
  game.players.forEach((p) => (p.lastPlayed = p.played));
  game.summaryInfo.draw = false;
  const battleWinner = getBattleWinner(game);
  if (battleWinner) {
    battleWinner.collected.push(game.middlecard, battleWinner.played);
    const playedCardIdx = battleWinner.hand.indexOf(battleWinner.played);
    battleWinner.hand = battleWinner.hand
      .slice(0, playedCardIdx)
      .concat(battleWinner.hand.slice(playedCardIdx + 1));

    if (checkRoundVictory(battleWinner, game)) {
      battleWinner.points++;
      if (battleWinner.points >= 5) {
        //CHANGE TO POINTS_TO_WIN[players.length] or something
        game.gameover = true;
      } else {
        startRound(game);
      }
    }
  } else {
    //check for draw
    const hands = game.players.map((p) => p.hand);
    if (hands.every((h) => h.length === 1) && hands.every((h) => h[0] === hands[0][0])) {
      startRound(game);
      game.summaryInfo.draw = true;
    }
  }
  startBattle(game);
};

const startRound = (game) => {
  game.players.forEach((p) => {
    p.collected = [];
    p.hand = [1, 2, 3, 4, 5];
  });
};

const startBattle = (game) => {
  game.battleStart = moment();
  game.middlecard = Math.floor(Math.random() * 5 + 1);
  game.players.forEach((p) => (p.played = null));
  game.players
    .filter((p) => p.user.bot)
    .forEach((p) => (p.played = p.hand[Math.floor(Math.random() * p.hand.length)]));
};

const checkRoundVictory = (battleWinner, game) => {
  //CHECK IF THE ROUND IS WON BY DIAMONDS
  let diamonds = battleWinner.collected.reduce((acc, curr) => {
    return acc + CARDS[curr].diamonds;
  }, 0);
  if (diamonds >= 5) {
    game.summaryInfo.roundWon = false;
    game.summaryInfo.reason = 'GREATER_THAN_FIVE';
    return true;
  }
  //CHECK IF THE ROUND IS ONE BY THREE OF A KIND
  battleWinner.collected.sort();
  for (let i = 0; i < battleWinner.collected.length - 2; i++) {
    if (battleWinner.collected[i] === battleWinner.collected[i + 2]) {
      game.summaryInfo.roundWon = true;
      game.summaryInfo.reason = 'GREATER_THAN_FIVE';
      return true;
    }
  }

  game.summaryInfo.roundWon = false;
  return false;
};

const getBattleWinner = (game) => {
  const playedCards = game.players.map((p, i) => {
    return { card: p.played, idx: i };
  });
  const duplicates = [];
  for (let i = 0; i < playedCards.length; i++) {
    for (let j = i + 1; j < playedCards.length; j++) {
      if (playedCards[i].card === playedCards[j].card) {
        duplicates.push(playedCards[i].card);
      }
    }
  }
  const playedCardsNoDuplicates = playedCards.filter((item) => !duplicates.includes(item.card));
  if (playedCardsNoDuplicates.length === 0) {
    return null;
  }

  playedCardsNoDuplicates.sort((a, b) => a.card - b.card);
  let battleWinnerIdx;
  if (
    playedCardsNoDuplicates[0].card === 1 &&
    playedCardsNoDuplicates[playedCardsNoDuplicates.length - 1].card === 5
  ) {
    //IF THERE's A FIVE AND A ONE, ONE WINS
    battleWinnerIdx = playedCardsNoDuplicates[0].idx;
  } else {
    //OTHERWISE LARGEST NUMBER WINS
    battleWinnerIdx = playedCardsNoDuplicates[playedCardsNoDuplicates.length - 1].idx;
  }
  return game.players[battleWinnerIdx];
};

const populateUsers = async (game) => {
  const populatePlayer = (i) => game.populate(`players.${i}.user`).execPopulate();
  await Promise.all(game.players.map((p, i) => populatePlayer(i)));
};
