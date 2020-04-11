import React from 'react';
import LobbyTable from './LobbyTable';
import StartButton from './StartButton';

export default function Lobby(props) {
  // needs players, needs to know current user, and also which player is host
  const { game, player } = props;
  //are we the current user
  //userID hostID
  return (
    <div>
      {<LobbyTable {...game} />}
      {player._id === game.players[0]._id && <StartButton gameID={game._id} />}
    </div>
  );
}
