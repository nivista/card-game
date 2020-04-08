const Game = require('./models/game');
const CARDS = require('./utils/cards');

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

  const populatePlayer = (i) => game.populate(`players.${i}.user`).execPopulate();
  await Promise.all(game.players.map((p, i) => populatePlayer(i)));

  const player = await game.players.find((p) => p.user.equals(req.user._id));
  if (!player) {
    return res.status(400).send("You're not playing!");
  }

  res.send({ game, playerID: player._id });
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

  game.players.forEach((player) => {
    for (let card = 1; card <= 5; card++) {
      player.hand.push(card);
    }
  });
  game.middlecard = Math.floor(Math.random() * 5 + 1);

  game.save();
  res.send({ status: 'starting' });
};

exports.join = async (req, res) => {
  const gameID = req.body;
  let game;
  try {
    game = await Game.findById(gameID);
  } catch (e) {
    console.log('exports.get');
    console.log(e);
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

exports.leave = (req, res) => {};

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

  const battleWinner = getBattleWinner(game);
  if (battleWinner) {
    battleWinner.collected.push(game.middlecard, battleWinner.played);
    const playedCardIdx = battleWinner.hand.indexOf(battleWinner.played);
    battleWinner.hand = battleWinner.hand
      .slice(0, playedCardIdx)
      .concat(battleWinner.hand.slice(playedCardIdx + 1));

    if (checkRoundVictory(battleWinner)) {
      battleWinner.points++;
      if (battleWinner.points >= 5) {
        //CHANGE TO POINTS_TO_WIN[players.length] or something
        game.gameover = true;
      } else {
        startRound(game);
      }
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
  game.middlecard = Math.floor(Math.random() * 5 + 1);
  game.players.forEach((p) => (p.played = null));
};

const checkRoundVictory = (battleWinner) => {
  //CHECK IF THE ROUND IS WON BY DIAMONDS
  let diamonds = battleWinner.collected.reduce((acc, curr) => {
    return acc + CARDS[curr].diamonds;
  }, 0);
  if (diamonds >= 5) return true;
  //CHECK IF THE ROUND IS ONE BY THREE OF A KIND
  battleWinner.collected.sort();
  for (let i = 0; i < battleWinner.collected.length - 2; i++) {
    if (battleWinner.collected[i] === battleWinner.collected[i + 2]) return true;
  }
  return false;
};

const getBattleWinner = (game) => {
  const playedCards = game.players.map((p, i) => {
    return { card: p.played, idx: i };
  });

  const duplicates = [];
  for (let i = 0; i < playedCards.length; i++) {
    for (let j = i + 1; j < playedCards.length; j++) {
      if (playedCards[i] === playedCards[j]) {
        duplicates.push(playedCards[i]);
      }
    }
  }
  const playedCardsNoDuplicates = playedCards.filter((card) => !duplicates.includes(card));
  if (playedCardsNoDuplicates.length === 0) {
    return null;
  }
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
