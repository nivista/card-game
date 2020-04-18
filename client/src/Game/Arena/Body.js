import React, { useState, useEffect } from 'react';
import TypeWriterCore from 'typewriter-effect/dist/core';

export default function Body(props) {
  const [typeWriterRef, updateTypeWriterRef] = useState(null);
  //print all moves
  //print who got eliminated for playing the same card
  //print who won, or if it was a draw, and how the collections change

  const allText = getAllText(props);
  //biggest card wins
  const joined = allText.join('|');
  useEffect(() => {
    //QUESTION : ARE WE GAURANTEED THAT typewriterref is initialized
    if (typeWriterRef) {
      const typeWriter = new TypeWriterCore(typeWriterRef);
      const split = joined.split('|');
      typeWriter.changeDelay(15);
      split.forEach((line) =>
        typeWriter.typeString('>>> ' + line + String.raw`<br />`).pauseFor(250)
      );
      typeWriter.typeString('>>> ');

      typeWriter.start();
      return () => {
        typeWriter.stop();
      };
    }
  }, [joined, typeWriterRef]);

  return (
    <div className="body">
      <span ref={updateTypeWriterRef}></span>
    </div>
  );
}

function getAllText({ gameover, playerID, players, summaryInfo }) {
  const playedCardsText = players.map((player) => namePlayedCard(player, playerID));

  const playersByCard = [null, [], [], [], [], []];
  players.forEach((player) => {
    playersByCard[player.lastPlayed].push(player);
  });

  const eliminatedText = playersByCard
    .map((cardPlayers, card) => {
      if (card === 0 || cardPlayers.length < 2) return null;
      return namesGotEliminated(cardPlayers, card, playerID);
    })
    .filter((line) => line);

  const remainingPlayers = [];
  playersByCard.forEach((cardPlayers, card) => {
    if (card === 0 || cardPlayers.length !== 1) return;
    remainingPlayers.push(cardPlayers[0]);
  });

  let winnerText;
  if (remainingPlayers.length === 0) {
    winnerText = `Draw, no one wins.`;
  } else if (
    remainingPlayers[remainingPlayers.length - 1].lastPlayed === 5 &&
    remainingPlayers[0].lastPlayed === 1
  ) {
    let name = getProperName(remainingPlayers[0], playerID, true);
    winnerText = `${name} won because 1 beats 5.`;
  } else {
    let name = getProperName(remainingPlayers[remainingPlayers.length - 1], playerID, true);
    winnerText = `${name} won with the highest card.`;
  }

  let summaryText = [];
  if (remainingPlayers.length === 0) {
    summaryText.push('The big card goes back in the pile and a new battle starts.');
  } else {
    summaryText.push('The winner adds the card they played and the big card to their collection.');
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
      summaryText.push('This wins the game! Thanks for playing.');
    }
  }
  return playedCardsText.concat(eliminatedText).concat(winnerText).concat(summaryText);
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
