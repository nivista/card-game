import React from 'react';
import TypeWriter from 'typewriter-effect';
export default function Body(props) {
  const { gameover, playerID, battleStart, players, summaryInfo } = props;
  //print all moves
  //print who got eliminated for playing the same card
  //print who won, or if it was a draw, and how the collections change

  if (!players[0].lastPlayed) return null; //TODO:: REMOVE THIS AFTER MAKING THIS TEMP ELEMENT OF DOM TREE

  const playedCardsText = players.map((player) => namePlayedCard(player, playerID));

  const playersByCard = [null, [], [], [], [], []];
  players.forEach((player) => {
    playersByCard[player.lastPlayed].push(player);
  });

  const eliminatedText = playersByCard
    .map((cardPlayers, card) => {
      if (card === 0 || cardPlayers.length < 2) return;
      return namesGotEliminated(cardPlayers, card, playerID);
    })
    .filter((line) => line);

  const remainingPlayers = [];
  playersByCard.forEach((cardPlayers, card) => {
    if (card === 0 || cardPlayers.length != 1) return;
    remainingPlayers.push(cardPlayers[0]);
  });

  let winnerText;
  if (remainingPlayers.length === 0) {
    winnerText = `Draw, no one wins.`;
  } else if (remainingPlayers[remainingPlayers.length - 1] === 5 && remainingPlayers[0] === 1) {
    let name = getProperName(remainingPlayers[0], playerID, true);
    winnerText = `${name} won because 1 beats 5.`;
  } else {
    let name = getProperName(remainingPlayers[remainingPlayers.length - 1], playerID, true);
    winnerText = `${name} won with the highest card.`;
  }

  let summaryText = [];
  if (remainingPlayers.length === 0) {
    if (gameover) {
    }
    summaryText.push('The big card goes back in the pile and a new battle starts.');
  } else {
    summaryText.push('The winner adds the card they played and the big card to their pile.');
    console.log(summaryInfo);
    if (summaryInfo.roundWon) {
      if (summaryInfo.reason === 'THREE_OF_A_KIND') {
        summaryText.push(
          'This wins the round because they have three of the same card. A new round will start.'
        );
      } else {
        summaryText.push(
          'This wins the round because the total "+" count is 5 or greater. A new round will start.'
        );
      }
    } else if (summaryInfo.draw) {
      summaryText.push(
        "Congatulations! You found the edge case where there's a draw. A new round will start."
      );
    }
    if (gameover) {
      summaryText.push('This wins the game! Thanks for playing');
    }
  }

  //biggest card wins
  let allText = playedCardsText.concat(eliminatedText).concat(winnerText).concat(summaryText);
  let string = allText.join('\n');
  return (
    <div className="body">
      <TypeWriter
        options={{
          wrapperClassName: 'typewriter',
          delay: 10,
        }}
        onInit={(typewriter) => {
          typewriter.typeString(string).start();
        }}
      />
    </div>
  );
}

function namePlayedCard(player, playerID) {
  let card = player.lastPlayed;
  let name = getProperName(player, playerID, true);
  return `${name} played a ${card}.`;
}

function namesGotEliminated(cardPlayers, card, playerID) {
  let names = '';
  cardPlayers.forEach((player, i) => {
    let name = getProperName(player, playerID, i === 0);
    if (i === cardPlayers.length - 1) {
      names += 'and ' + name;
    } else if (i === cardPlayers.length - 2) {
      names += name + ' ';
    } else {
      names += name + ', ';
    }
  });
  return `${names} got eliminated for all playing ${card}.`;
}

function getProperName(player, playerID, isBeggining) {
  if (playerID !== player._id) {
    return player.user.nickname;
  } else if (isBeggining) {
    return 'You';
  } else {
    return 'you';
  }
}
