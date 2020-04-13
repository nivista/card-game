import React from 'react';

import Name from './Name';
import Points from './Points';
import LeaveGame from './LeaveGame';
import Opponents from './Opponents';
import Time from './Time';
import Middlecard from './Middlecard';
import HandCollection from './HandCollection';
import Arena from './Arena';
import './style.css';

export default function Game(props) {
  const {
    game: { battleStart, summaryInfo, middlecard, gameover, players, _id: gameID },
    player: {
      user: { nickname },
      hand,
      collected,
      played,
      points,
      lastPlayed,
      _id: playerID,
    },
  } = props;

  const playersExcludeSelf = players.filter((p) => p._id != playerID);
  return (
    <div className="container">
      <Name nickname={nickname} />
      <Points points={points} />
      <LeaveGame gameID={gameID} />
      <Opponents opponents={playersExcludeSelf} />
      <Time battleStart={battleStart} />
      <Middlecard middlecard={middlecard} />
      <HandCollection hand={hand} collection={collected} played={played} gameID={gameID} />
      <Arena
        playerID={playerID}
        battleStart={battleStart}
        players={players}
        summaryInfo={summaryInfo}
      />
    </div>
  );
}
