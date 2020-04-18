import React from 'react';

import Name from '../utils/Name';
import Points from './Points';
import LeaveGame from '../utils/LeaveGame';
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
      _id: playerID,
    },
  } = props;

  const playersExcludeSelf = players.filter((p) => p._id !== playerID);
  return (
    <div className="container" id="gameContainer">
      <Name nickname={nickname} />
      <Points points={points} />
      <LeaveGame gameID={gameID} />
      <Opponents opponents={playersExcludeSelf} />
      <Time battleStart={battleStart} gameover={gameover} />
      <Middlecard middlecard={middlecard} />
      <HandCollection hand={hand} collection={collected} played={played} gameID={gameID} />
      <Arena playerID={playerID} players={players} summaryInfo={summaryInfo} gameover={gameover} />
    </div>
  );
}
