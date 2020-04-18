import React from 'react';
import Header from './Header';
import LobbyControl from './LobbyControl';
import Rules from './Rules';
import './style.css';

export default function Lobby(props) {
  const { players, gameID, player } = props;
  let isHost = players[0]._id === player._id;

  const playersExcludeSelf = players.filter((p) => p._id !== player._id);
  return (
    <div className="container" id="lobby">
      <Header nickname={player.user.nickname} gameID={gameID} />
      <LobbyControl players={playersExcludeSelf} isHost={isHost} gameID={gameID} />
      <Rules />
    </div>
  );
}
