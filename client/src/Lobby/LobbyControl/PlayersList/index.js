import React from 'react';
import Player from './Player';
import './style.css';

export default function PlayersList(props) {
  const { players, gameID, isHost } = props;
  if (players.length === 0) {
    return <div className="emptyPlayersList">Just you so far!</div>;
  } else {
    return (
      <ul className="playersList">
        {players.map((p) => (
          <Player
            id={p._id}
            nickname={p.user.nickname}
            gameID={gameID}
            isHost={isHost}
            key={p._id}
          />
        ))}
      </ul>
    );
  }
}
